import { backendJson } from "@/lib/backendApi";

export async function GET(req: Request) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  writer.write(
    encoder.encode("retry: 2000\nevent: connected\ndata: connected\n\n")
  );

  try {
    const result = await backendJson("/api/table?table=GTPL_118_GT_60T_S7_1200");

    if (result.success && result.data) {
      writer.write(
        encoder.encode(`event: message\ndata: ${JSON.stringify(result.data)}\n\n`)
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
    console.error("Backend API Error:", err);
    writer.write(
      encoder.encode(
        `event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`
      )
    );
  }

  req.signal.addEventListener("abort", () => {
    console.log("SSE client disconnected.");
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
