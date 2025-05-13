import mysql from "mysql2/promise";

export async function GET(req: Request) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  writer.write(encoder.encode("retry: 2000\nevent: connected\ndata: connected\n\n"));

  try {
    const connection = await mysql.createConnection({
      host: "myshaa.com",                   
      user: "myshaa_iotdatatest",           
      password: "j5f8%JUqUk_=",              
      database: "myshaa_iotdatatest",    
      port:3306 
    });

    const [rows]: any = await connection.execute("SELECT * FROM myshaa_iotdatatest ORDER BY id DESC LIMIT 1");
    await connection.end();

    const latest = rows[0];

    if (latest) {
      writer.write(encoder.encode(`event: message\ndata: ${JSON.stringify(latest)}\n\n`));
    } else {
      writer.write(encoder.encode(`event: message\ndata: ${JSON.stringify({ message: "No data found" })}\n\n`));
    }

    writer.close();
  } catch (err) {
    console.error("DB fetch error:", err);
    writer.write(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: "Database error" })}\n\n`));
    writer.close();
  }

  req.signal.addEventListener("abort", () => {
    console.log("SSE client disconnected early.");
    writer.close();
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
