import { NextRequest } from "next/server";
import { backendJson } from "@/lib/backendApi";
import { MACHINE_CONFIG, MACHINE_NAME_ALIASES } from "@/lib/machineConfig";

// Simple SSE stream helper
function streamText(iterable: AsyncIterable<string> | Iterable<string>) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (data: string) =>
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      try {
        for await (const chunk of iterable as AsyncIterable<string>) {
          send(chunk);
        }
        // signal end of stream
        controller.enqueue(encoder.encode("event: done\n\n"));
      } catch (error) {
        send(JSON.stringify({ error: (error as Error).message }));
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

type Provider = "openai" | "openrouter";

async function* callProviderStream({
  messages,
  provider,
  model,
}: {
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  provider: Provider;
  model?: string;
}): AsyncGenerator<string> {
  const sysPrompt =
    "You are a fast, helpful assistant. Detect the user's language and reply in the same language. Keep responses concise unless asked for detail.";
  const finalMessages = [
    { role: "system", content: sysPrompt } as const,
    ...messages,
  ];

  const baseUrl =
    provider === "openrouter"
      ? "https://openrouter.ai/api/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
  const apiKey =
    provider === "openrouter"
      ? process.env.OPENROUTER_API_KEY
      : process.env.OPENAI_API_KEY;
  const authHeader =
    provider === "openrouter" ? `Bearer ${apiKey}` : `Bearer ${apiKey}`;
  const usedModel =
    model || (provider === "openrouter" ? "openai/gpt-4o-mini" : "gpt-4o-mini");

  if (!apiKey) {
    throw new Error(
      provider === "openrouter"
        ? "Missing OPENROUTER_API_KEY"
        : "Missing OPENAI_API_KEY"
    );
  }

  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
      ...(provider === "openrouter"
        ? {
            "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
            "X-Title": "New HMI Dashboard",
          }
        : {}),
    },
    body: JSON.stringify({
      model: usedModel,
      messages: finalMessages,
      stream: true,
      temperature: 0.2,
    }),
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upstream error ${res.status}: ${text || res.statusText}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";
    for (const part of parts) {
      if (!part.startsWith("data:")) continue;
      const data = part.slice(5).trim();
      if (data === "[DONE]") {
        return;
      }
      try {
        const json = JSON.parse(data);
        // OpenAI & OpenRouter compatible delta parsing
        const delta =
          json.choices?.[0]?.delta?.content ??
          json.choices?.[0]?.message?.content ??
          "";
        if (delta) {
          yield delta as string;
        }
      } catch {
        // non-JSON lines; ignore
      }
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages, provider, model } = (await req.json()) as {
      messages: Array<{
        role: "system" | "user" | "assistant";
        content: string;
      }>;
      provider?: Provider;
      model?: string;
    };
    if (!messages?.length) {
      return Response.json({ error: "messages required" }, { status: 400 });
    }

    // Lightweight intent: machine data query
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const userText = lastUser?.content || "";
    const machineIntent =
      /(temp|temperature|t0|t1|t2|th|pressure|rpm|speed|status|fan|blower|compressor|heater|valve|machine|device)/i.test(
        userText
      );
    const comparisonIntent =
      /(compare|vs|versus|between|difference|change|history|previous|yesterday|today|date)/i.test(
        userText
      );

    function resolveMachineName(raw: string): string | null {
      // Try exact key
      if (MACHINE_CONFIG[raw as keyof typeof MACHINE_CONFIG]) return raw;
      // Try alias map
      const alias = MACHINE_NAME_ALIASES[raw];
      if (alias && MACHINE_CONFIG[alias as keyof typeof MACHINE_CONFIG])
        return alias;
      // Try includes matching on known keys
      const keys = Object.keys(MACHINE_CONFIG);
      const found = keys.find((k) =>
        raw.toLowerCase().includes(k.toLowerCase())
      );
      if (found) return found;
      // Try includes on alias keys
      const aliasKey = Object.keys(MACHINE_NAME_ALIASES).find((k) =>
        raw.toLowerCase().includes(k.toLowerCase())
      );
      if (aliasKey) return MACHINE_NAME_ALIASES[aliasKey];
      return null;
    }

    async function fetchMachineData(
      machineName: string,
      limit: number = 1,
      dateFilter?: string
    ): Promise<Record<string, any>[]> {
      const config = MACHINE_CONFIG[
        machineName as keyof typeof MACHINE_CONFIG
      ] as { table: string; type: string } | undefined;
      if (!config)
        throw new Error(`No configuration found for machine: ${machineName}`);

      const table = config.table;

      if (dateFilter) {
        // Use Go backend paginated endpoint with date filtering
        let fromDate = "";
        let toDate = "";
        if (dateFilter.toLowerCase() === "yesterday") {
          const yesterday = new Date(Date.now() - 86400000);
          fromDate = yesterday.toISOString().split("T")[0];
          toDate = fromDate;
        } else if (dateFilter.toLowerCase() === "today") {
          fromDate = new Date().toISOString().split("T")[0];
          toDate = fromDate;
        } else {
          fromDate = dateFilter;
          toDate = dateFilter;
        }
        const params = new URLSearchParams({ table, page: "1", limit: String(limit) });
        if (fromDate) params.set("from", `${fromDate} 00:00:00`);
        if (toDate) params.set("to", `${toDate} 23:59:59`);
        const result = await backendJson(`/api/all700data/paginatedSmart200?${params.toString()}`);
        return Array.isArray(result.data) ? result.data : [];
      }

      // No date filter - get latest records
      if (limit === 1) {
        const result = await backendJson(`/api/table?table=${encodeURIComponent(table)}`);
        return result.success && result.data ? [result.data] : [];
      }
      const result = await backendJson(`/api/all700data/paginatedSmart200?table=${encodeURIComponent(table)}&page=1&limit=${limit}`);
      return Array.isArray(result.data) ? result.data : [];
    }

    function formatMachineData(
      record: Record<string, any>,
      machineName: string
    ): string {
      const ts =
        record.created_on || record.created_at || record.timestamp || null;
      const when = ts ? new Date(ts).toISOString() : "unknown time";

      const val = (x: any) =>
        x === undefined || x === null ? null : Number(x);
      const bool = (x: any) =>
        x === 1 || x === "true" || x === "tr" || x === true || x === "True";

      const parts: string[] = [];

      // Temperatures
      const t0 =
        val(record.AIR_OUTLET_TEMP) ??
        val(record.T0_temp_mean) ??
        val(record.T0) ??
        null;
      const t1 =
        val(record.COLD_AIR_TEMP_T1) ??
        val(record.T1_temp_mean) ??
        val(record.T1) ??
        null;
      const t2 =
        val(record.AMBIENT_AIR_TEMP_T2) ??
        val(record.T2_temp_mean) ??
        val(record.T2) ??
        null;
      const th =
        val(record.AFTER_HEATER_TEMP_Th) ??
        val(record.TH_temp_mean) ??
        val(record.TH) ??
        null;

      if (t0 !== null) parts.push(`T0: ${t0.toFixed(1)}°C`);
      if (t1 !== null) parts.push(`T1: ${t1.toFixed(1)}°C`);
      if (t2 !== null) parts.push(`T2: ${t2.toFixed(1)}°C`);
      if (th !== null) parts.push(`TH: ${th.toFixed(1)}°C`);

      // Pressures
      const lp =
        val(record.LP) ??
        val(record.LOW_PRESSURE) ??
        val(record.SUCTION_PRESSURE) ??
        null;
      const hp =
        val(record.HP) ??
        val(record.HIGH_PRESSURE) ??
        val(record.DISCHARGE_PRESSURE) ??
        null;

      if (lp !== null) parts.push(`LP: ${lp.toFixed(1)} bar`);
      if (hp !== null) parts.push(`HP: ${hp.toFixed(1)} bar`);

      // Speeds/RPMs
      const blower = val(record.BLOWER_RPM) ?? val(record.BLOWER_SPEED) ?? null;
      const fan =
        val(record.Condenser_fan_speed) ?? val(record.COND_FAN_SPEED) ?? null;
      const heater =
        val(record.Heater_speed) ?? val(record.HEATER_SPEED) ?? null;

      if (blower !== null) parts.push(`Blower: ${blower.toFixed(0)} RPM`);
      if (fan !== null) parts.push(`Fan: ${fan.toFixed(0)} RPM`);
      if (heater !== null) parts.push(`Heater: ${heater.toFixed(0)}%`);

      // Status flags
      const compressor =
        bool(record.Compressor_on_Q0_4) ?? bool(record.COMPRESSOR_ON) ?? null;
      const condFan =
        bool(record.COND_FAN_ON) ?? bool(record.cond_fan_on) ?? null;
      const heaterOn = bool(record.HEATER_ON) ?? bool(record.Heater_on) ?? null;

      if (compressor !== null)
        parts.push(`Compressor: ${compressor ? "ON" : "OFF"}`);
      if (condFan !== null) parts.push(`Cond Fan: ${condFan ? "ON" : "OFF"}`);
      if (heaterOn !== null) parts.push(`Heater: ${heaterOn ? "ON" : "OFF"}`);

      if (parts.length === 0) return `No data fields found for ${machineName}`;

      return `${machineName} @ ${when}\n${parts.join(" | ")}`;
    }

    async function compareMachines(
      machine1: string,
      machine2: string
    ): Promise<string> {
      const [data1, data2] = await Promise.all([
        fetchMachineData(machine1, 1),
        fetchMachineData(machine2, 1),
      ]);

      if (!data1.length) return `No data found for ${machine1}`;
      if (!data2.length) return `No data found for ${machine2}`;

      const formatted1 = formatMachineData(data1[0], machine1);
      const formatted2 = formatMachineData(data2[0], machine2);

      return `COMPARISON:\n\n${formatted1}\n\n${formatted2}`;
    }

    async function compareMachineHistory(
      machineName: string,
      date1: string,
      date2: string
    ): Promise<string> {
      const [data1, data2] = await Promise.all([
        fetchMachineData(machineName, 1, date1),
        fetchMachineData(machineName, 1, date2),
      ]);

      if (!data1.length) return `No data found for ${machineName} on ${date1}`;
      if (!data2.length) return `No data found for ${machineName} on ${date2}`;

      const formatted1 = formatMachineData(
        data1[0],
        `${machineName} (${date1})`
      );
      const formatted2 = formatMachineData(
        data2[0],
        `${machineName} (${date2})`
      );

      return `HISTORY COMPARISON:\n\n${formatted1}\n\n${formatted2}`;
    }

    if (machineIntent) {
      // Try to resolve machine names from the user text
      const allNames = [
        ...Object.keys(MACHINE_CONFIG),
        ...Object.keys(MACHINE_NAME_ALIASES),
      ].sort((a, b) => b.length - a.length);

      const resolvedMachines: string[] = [];
      for (const name of allNames) {
        if (userText.toLowerCase().includes(name.toLowerCase())) {
          const found = resolveMachineName(name);
          if (found && !resolvedMachines.includes(found)) {
            resolvedMachines.push(found);
          }
        }
      }

      if (resolvedMachines.length > 0) {
        return streamText(
          (async function* () {
            try {
              if (comparisonIntent && resolvedMachines.length >= 2) {
                // Compare two machines
                const result = await compareMachines(
                  resolvedMachines[0],
                  resolvedMachines[1]
                );
                yield result;
              } else if (comparisonIntent && resolvedMachines.length === 1) {
                // Compare machine history - look for date patterns
                const datePattern = /(yesterday|today|\d{4}-\d{2}-\d{2})/gi;
                const dates = userText.match(datePattern);
                if (dates && dates.length >= 2) {
                  const result = await compareMachineHistory(
                    resolvedMachines[0],
                    dates[0],
                    dates[1]
                  );
                  yield result;
                } else {
                  // Single machine, latest data
                  const data = await fetchMachineData(resolvedMachines[0], 1);
                  if (data.length > 0) {
                    yield formatMachineData(data[0], resolvedMachines[0]);
                  } else {
                    yield `No data found for ${resolvedMachines[0]}`;
                  }
                }
              } else {
                // Single machine, latest data
                const data = await fetchMachineData(resolvedMachines[0], 1);
                if (data.length > 0) {
                  yield formatMachineData(data[0], resolvedMachines[0]);
                } else {
                  yield `No data found for ${resolvedMachines[0]}`;
                }
              }
            } catch (error) {
              yield `Error: ${(error as Error).message}`;
            }
          })()
        );
      }
    }
    const usedProvider: Provider =
      provider || (process.env.OPENROUTER_API_KEY ? "openrouter" : "openai");
    return streamText(
      callProviderStream({ messages, provider: usedProvider, model })
    );
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
