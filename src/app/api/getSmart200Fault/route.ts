import { pool } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;
  const search = searchParams.get("search")?.trim() || "";

  try {
    let whereClause = "";
    const values: any[] = [];

    // ✅ Adjust column name here based on your DB schema
    if (search) {
      whereClause = "WHERE machine_name LIKE ?";
      values.push(`%${search}%`);
    }

    // ✅ Count query
    const [[{ count }]]: any = await pool.query(
      `SELECT COUNT(*) AS count FROM kabomachinedatasmart200 ${whereClause}`,
      values
    );

    // ✅ Data query
    const [rows]: any = await pool.query(
      `SELECT * FROM kabomachinedatasmart200 ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...values, limit, offset]
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
        search,
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
