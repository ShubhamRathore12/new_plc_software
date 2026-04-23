import { backendJson } from "@/lib/backendApi";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const page = searchParams.get("page") || "1";

    if (!table) {
      return Response.json({ error: "Invalid or missing table name" }, { status: 400 });
    }

    // Build query params for Go backend /api/reports
    const params = new URLSearchParams({ table, page });
    if (fromDate) params.set("fromDate", fromDate);
    if (toDate) params.set("toDate", toDate);

    const result = await backendJson(`/api/reports?${params.toString()}`);

    return Response.json(result);
  } catch (err: any) {
    console.error("getReports error:", err?.message);
    return Response.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
