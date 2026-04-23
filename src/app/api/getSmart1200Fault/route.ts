import { backendJson } from "@/lib/backendApi";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  try {
    // Get paginated data from Go backend
    const result = await backendJson(
      `/api/all700data/paginatedSmart1200?table=gtpl_122_s7_1200_01&page=${page}&limit=${limit}`
    );

    const rows = Array.isArray(result.data) ? result.data : [];
    const total = result.total || 0;
    const totalPages = result.totalPages || Math.ceil(total / limit);

    return new Response(
      JSON.stringify({
        data: rows,
        total,
        totalPages,
        page,
        limit,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    console.error("DB fetch error:", err?.message || err);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
