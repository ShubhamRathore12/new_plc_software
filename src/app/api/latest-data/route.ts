import mysql from "mysql2/promise";

// Create a global connection pool (shared across requests)
const pool = mysql.createPool({
  host: "myshaa.com",
  user: "myshaa_iotdatatest",
  password: "j5f8%JUqUk_=",
  database: "myshaa_iotdatatest",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

export async function GET(req: Request) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  writer.write(
    encoder.encode("retry: 2000\nevent: connected\ndata: connected\n\n")
  );

  try {
    const [rows]: any = await pool.execute(
      "SELECT * FROM iot_data ORDER BY id DESC LIMIT 1"
    );

    const latest = rows[0];

    if (latest) {
      writer.write(
        encoder.encode(`event: message\ndata: ${JSON.stringify(latest)}\n\n`)
      );
    } else {
      writer.write(
        encoder.encode(
          `event: message\ndata: ${JSON.stringify({
            message: "No data found",
          })}\n\n`
        )
      );
    }
  } catch (err: any) {
    console.error("❌ DB Error:", err);
    writer.write(
      encoder.encode(
        `event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`
      )
    );
  }

  req.signal.addEventListener("abort", () => {
    console.log("🔌 SSE client disconnected.");
    writer.close();
  });

  writer.close();

  return new Response(readable, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
