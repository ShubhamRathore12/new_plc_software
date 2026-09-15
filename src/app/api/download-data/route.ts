import { backendJson } from "@/lib/backendApi";

// All available tables
const ALLOWED_TABLES = [
  "GTPL_108_gT_40E_P_S7_200_Germany",
  "GTPL_109_gT_40E_P_S7_200_Germany",
  "GTPL_110_gT_40E_P_S7_200_Germany",
  "GTPL_111_gT_80E_P_S7_200_Germany",
  "GTPL_112_gT_80E_P_S7_200_Germany",
  "GTPL_113_gT_80E_P_S7_200_Germany",
  "GTPL_118_GT_60T_S7_1200",
  "GTPL_149_GT_60T_S7_1200",
  "GTPL_114_GT_140E_S7_1200",
  "GTPL_044_GT_140E_S7_1200",
  "GTPL_115_GT_180E_S7_1200",
  "GTPL_119_GT_180E_S7_1200",
  "GTPL_120_GT_180E_S7_1200",
  "GTPL_116_GT_240E_S7_1200",
  "GTPL_117_GT_320E_S7_1200",
  "GTPL_068_GT_650T_S7_1200",
  "GTPL_104_GT_650T_S7_1200",
  "GTPL_121_GT1000T",
  "gtpl_122_s7_1200_01",
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table") || "GTPL_118_GT_60T_S7_1200";
    const format = searchParams.get("format") || "csv";
    const limit = parseInt(searchParams.get("limit") || "1000", 10);

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

    // Get paginated data from Go backend
    const result = await backendJson(
      `/api/all700data/paginatedSmart200?table=${encodeURIComponent(table)}&page=1&limit=${limit}`
    );

    const rows = Array.isArray(result.data) ? result.data : [];

    if (format === "csv") {
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
    console.error("Download error:", err?.message || err);
    return new Response(JSON.stringify({ error: "Backend API error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
