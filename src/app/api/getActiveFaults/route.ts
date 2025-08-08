import { pool } from "@/lib/db";
import { MACHINE_CONFIG, MACHINE_NAME_ALIASES } from "@/lib/machineConfig";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Resolve machine name (with alias map)
  const rawMachineName = searchParams.get("machineName")?.trim() || "";
  const machineName = MACHINE_NAME_ALIASES[rawMachineName] || rawMachineName;

  // Optional: override table via query (you were doing this for GTPL-30)
  const overrideTable = searchParams.get("tableName")?.trim();

  // Pagination params
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const limitParam = parseInt(searchParams.get("limit") || "200", 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const limit =
    Number.isFinite(limitParam) && limitParam > 0
      ? Math.min(limitParam, 2000) // hard cap to be safe
      : 200;
  const offset = (page - 1) * limit;

  // (Optional) NOTE: We ignore `search` here since this endpoint is now "normal".
  // If you later want server-side search, we can add a safe WHERE builder for specific columns.

  const machineConfig =
    MACHINE_CONFIG[machineName as keyof typeof MACHINE_CONFIG];

  if (!machineConfig) {
    return new Response(
      JSON.stringify({
        error: `No configuration found for machine: ${machineName}`,
        availableMachines: Object.keys(MACHINE_CONFIG),
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const table = overrideTable || machineConfig.table;

    // 1) Total count
    const [countRows] = (await pool.query(
      `SELECT COUNT(*) AS cnt FROM \`${table}\``
    )) as any[];
    const total: number = countRows?.[0]?.cnt ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    // 2) Page data (ordered newest first)
    const [rows] = (await pool.query(
      `SELECT * FROM \`${table}\` ORDER BY id DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    )) as any[];

    return new Response(
      JSON.stringify({
        data: Array.isArray(rows) ? rows : [],
        total,
        totalPages,
        page,
        limit,
        machineName,
        machineType: machineConfig.type,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Error fetching logs:", err?.message || err);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch logs",
        details: err?.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
