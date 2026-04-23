import { backendJson } from "@/lib/backendApi";

export async function GET(req: Request) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Set headers for SSE
  writer.write(
    encoder.encode(
      "retry: 2000\n" +
        "event: connected\ndata: connected\n\n"
    )
  );

  let lastInsertedId = 0;

  const interval = setInterval(async () => {
    try {
      const result = await backendJson("/api/table?table=GTPL_118_GT_60T_S7_1200");
      const latest = result.success ? result.data : null;

      if (latest && latest.id > lastInsertedId) {
        lastInsertedId = latest.id;
        writer.write(
          encoder.encode(`event: message\ndata: ${JSON.stringify(latest)}\n\n`)
        );
      }
    } catch (err) {
      console.error("Backend fetch error:", err);
      writer.write(
        encoder.encode(
          `event: error\ndata: ${JSON.stringify({ error: "Backend API error" })}\n\n`
        )
      );
    }
  }, 2000);

  const close = () => {
    clearInterval(interval);
    writer.close();
  };

  req.signal.addEventListener("abort", () => {
    console.log("SSE client disconnected.");
    close();
  });

  return new Response(readable, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
