import { pool } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM plcdatatest ORDER BY dt DESC LIMIT 1"
    );

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
