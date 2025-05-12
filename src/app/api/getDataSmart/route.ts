import mysql from "mysql2/promise";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const connection = await mysql.createConnection({
          host: "myshaa.com",         // 🔁 Replace with your MySQL host
          user: "myshaa_iotdatatest",              // ✅ Your DB user
          password: "j5f8%JUqUk_=", // ✅ Your DB password
          database: "myshaa_iotdatatest",
          port:'3306' 
  
        });

        const [rows]: any = await connection.execute(
          "SELECT * FROM kabumachinedata ORDER BY id DESC LIMIT 100"
        );

        await connection.end();

        for (const row of rows) {
          const data = `data: ${JSON.stringify(row)}\n\n`;
          controller.enqueue(encoder.encode(data));
          await new Promise((res) => setTimeout(res, 100)); // ⏳ optional delay
        }

        controller.close();
      } catch (error: any) {
        controller.enqueue(
          encoder.encode(`event: error\ndata: ${error.message}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
