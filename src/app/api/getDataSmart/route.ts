import { pool } from "@/lib/db";

export async function GET(req: Request) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Set headers for SSE
  writer.write(
    encoder.encode(
      "retry: 2000\n" + // Try to reconnect every 10s if disconnected
        "event: connected\ndata: connected\n\n"
    )
  );

  let lastInsertedId = 0;

  const interval = setInterval(async () => {
    try {
      const [rows]: any = await pool.query(
        "SELECT * FROM kabomachinedatasmart200 ORDER BY id DESC LIMIT 1"
      );

      const latest = rows[0];

      if (latest && latest.id > lastInsertedId) {
        lastInsertedId = latest.id;
        writer.write(
          encoder.encode(`event: message\ndata: ${JSON.stringify(latest)}\n\n`)
        );
      }
    } catch (err: any) {
      console.error("DB fetch error:", err?.message || err);
      writer.write(
        encoder.encode(
          `event: error\ndata: ${JSON.stringify({
            error: err?.message || "DB error",
          })}\n\n`
        )
      );
    }
  }, 2000);

  const close = () => {
    clearInterval(interval);
    writer.close();
  };

  // Auto-close the connection if the client disconnects
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
