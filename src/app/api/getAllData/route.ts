import { pool } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM kabumachinedata ORDER BY id DESC LIMIT 100" // 🔥 Latest 100 rows
    );

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
