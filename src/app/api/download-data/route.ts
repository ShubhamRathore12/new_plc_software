import { pool } from "@/lib/db";
import { ALL_TABLE_NAMES } from "@/lib/machineRegistry";

// Derived from centralized registry
const ALLOWED_TABLES = ALL_TABLE_NAMES;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table") || "kabomachinedatasmart200";
    const format = searchParams.get("format") || "csv"; // csv or json
    const limit = parseInt(searchParams.get("limit") || "1000", 10);

    // Validate table name
    if (!ALLOWED_TABLES.includes(table)) {
      return new Response(
        JSON.stringify({
          error: "Invalid table name",
          allowedTables: ALLOWED_TABLES,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get data
    const [rows]: any = await pool.query(
      `SELECT * FROM \`${table}\` ORDER BY id DESC LIMIT ?`,
      [limit]
    );

    if (format === "csv") {
      // Convert to CSV
      if (rows.length === 0) {
        return new Response("No data found", {
          status: 404,
          headers: { "Content-Type": "text/plain" },
        });
      }

      const headers = Object.keys(rows[0]);
      const csvContent = [
        headers.join(","),
        ...rows.map((row: any) =>
          headers
            .map((header) => {
              const value = row[header];
              // Escape commas and quotes in CSV
              if (
                typeof value === "string" &&
                (value.includes(",") || value.includes('"'))
              ) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value;
            })
            .join(",")
        ),
      ].join("\n");

      const filename = `${table}_${new Date().toISOString().split("T")[0]}.csv`;

      return new Response(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    } else {
      // Return JSON
      const filename = `${table}_${new Date().toISOString().split("T")[0]}.json`;

      return new Response(JSON.stringify(rows, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }
  } catch (err: any) {
    // Table doesn't exist yet — return friendly error instead of 500
    if (err?.errno === 1146) {
      return new Response(JSON.stringify({ error: "Table not yet available in the database" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.error("Download error:", err?.message || err);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
