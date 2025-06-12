import { pool } from "@/lib/db";

export async function GET(req: Request) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Set headers for SSE
  await writer.write(
    encoder.encode(
      "retry: 2000\n" + // Try to reconnect every 2s if disconnected
        "event: connected\ndata: connected\n\n"
    )
  );

  let lastInsertedId = 0;
  let isConnected = true;

  // Initialize lastInsertedId to avoid sending all data on first connect
  try {
    const [rows]: any = await pool.query(
      "SELECT id FROM kabomachinedatasmart200 ORDER BY id DESC LIMIT 1"
    );
    if (rows && rows[0]) {
      lastInsertedId = rows[0].id;
    }
  } catch (err) {
    console.error("Initial DB fetch error:", err);
    await writer.write(
      encoder.encode(
        `event: error\ndata: ${JSON.stringify({ error: "Initial DB connection failed" })}\n\n`
      )
    );
  }

  const interval = setInterval(async () => {
    if (!isConnected) {
      clearInterval(interval);
      return;
    }

    try {
      // Check if connection is still alive
      if (!pool || typeof pool.query !== 'function') {
        throw new Error('Database pool is not available');
      }

      const [rows]: any = await pool.query(
        "SELECT * FROM kabomachinedatasmart200 ORDER BY id DESC LIMIT 1"
      );
      
      const latest = rows?.[0];

      if (latest && latest.id > lastInsertedId) {
        lastInsertedId = latest.id;
        try {
          await writer.write(
            encoder.encode(`event: message\ndata: ${JSON.stringify(latest)}\n\n`)
          );
        } catch (writeError) {
          console.error("Write error (client likely disconnected):", writeError);
          isConnected = false;
          clearInterval(interval);
        }
      }
    } catch (err) {
      console.error("DB fetch error:", err);
      
      // Only try to write error if connection is still active
      if (isConnected) {
        try {
          await writer.write(
            encoder.encode(
              `event: error\ndata: ${JSON.stringify({ 
                error: "DB error", 
                message: err instanceof Error ? err.message : 'Unknown error' 
              })}\n\n`
            )
          );
        } catch (writeError) {
          console.error("Error writing error message:", writeError);
          isConnected = false;
          clearInterval(interval);
        }
      }
    }
  }, 2000); // Check every 2 seconds

  const close = async () => {
    isConnected = false;
    clearInterval(interval);
    try {
      await writer.close();
    } catch (err) {
      console.error("Error closing writer:", err);
    }
  };

  // Auto-close the connection if the client disconnects
  req.signal.addEventListener("abort", () => {
    console.log("SSE client disconnected.");
    close();
  });

  // Also handle cleanup on process termination
  const cleanup = () => {
    close();
  };
  
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  return new Response(readable, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  });
}