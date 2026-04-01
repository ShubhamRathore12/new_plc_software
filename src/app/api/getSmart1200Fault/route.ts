import { query } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  try {
    // Get total count
    const countResult: any = await query(
      "SELECT COUNT(*) AS count FROM gtpl_122_s7_1200_01"
    );
    const count = countResult[0]?.count || 0;

    // Get paginated rows
    const rows: any = await query(
      `SELECT * FROM gtpl_122_s7_1200_01 ORDER BY id DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const total = Number(count);
    const totalPages = Math.ceil(total / limit);

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
