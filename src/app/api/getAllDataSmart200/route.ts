// import { pool } from "@/lib/db";
// import * as XLSX from "xlsx";

// const ALLOWED_TABLES = [
//   "GTPL_108_gT_40E_P_S7_200_Germany",
//   "GTPL_109_gT_40E_P_S7_200_Germany",
//   "GTPL_110_gT_40E_P_S7_200_Germany",
//   "GTPL_111_gT_80E_P_S7_200_Germany",
//   "GTPL_112_gT_80E_P_S7_200_Germany",
//   "GTPL_113_gT_80E_P_S7_200_Germany",
//   "kabomachinedatasmart200",
//   "GTPL_114_GT_140E_S7_1200",
//   "GTPL_115_GT_180E_S7_1200",
//   "GTPL_119_GT_180E_S7_1200",
//   "GTPL_120_GT_180E_S7_1200",
//   "GTPL_116_GT_240E_S7_1200",
//   "GTPL_117_GT_320E_S7_1200",
//   "GTPL_121_GT1000T",
//   "gtpl_122_s7_1200_01",
// ];

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const table = searchParams.get("table") || "kabomachinedatasmart200";
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const fromDate = searchParams.get("fromDate");
//     const toDate = searchParams.get("toDate");
//     const downloadAll = searchParams.get("downloadAll") === "true";
//     const limit = downloadAll ? 10000 : 100;
//     const offset = (page - 1) * limit;

//     if (!ALLOWED_TABLES.includes(table)) {
//       return new Response(
//         JSON.stringify({
//           error: "Invalid table name",
//           allowedTables: ALLOWED_TABLES,
//         }),
//         {
//           status: 400,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//     }

//     // Check timestamp column
//     let timestampColumn = '';
//     try {
//       const [checkLower]: any = await pool.query(
//         `SHOW COLUMNS FROM \`${table}\` LIKE 'created_at'`
//       );
//       if (checkLower.length > 0) {
//         timestampColumn = 'created_at';
//       } else {
//         const [checkUpper]: any = await pool.query(
//           `SHOW COLUMNS FROM \`${table}\` LIKE 'created_At'`
//         );
//         if (checkUpper.length > 0) {
//           timestampColumn = 'created_At';
//         }
//       }
//     } catch (err) {
//       console.error("Error checking timestamp columns:", err);
//     }

//     // Base queries
//     let countQuery = `SELECT COUNT(*) as total FROM \`${table}\``;
//     let dataQuery = `SELECT * FROM \`${table}\``;
//     const queryParams: any[] = [];

//     // Date filtering - apply to both count and data queries
//     if (timestampColumn && (fromDate || toDate)) {
//       let dateCondition = '';
      
//       if (fromDate) {
//         dateCondition += `\`${timestampColumn}\` >= ?`;
//         queryParams.push(fromDate);
//       }
      
//       if (toDate) {
//         if (fromDate) dateCondition += ' AND ';
//         dateCondition += `\`${timestampColumn}\` <= ?`;
//         queryParams.push(toDate);
//       }

//       if (dateCondition) {
//         countQuery += ` WHERE ${dateCondition}`;
//         dataQuery += ` WHERE ${dateCondition}`;
//       }
//     }

//     // Handle download all with SheetJS - FIXED VERSION
//     if (downloadAll) {
//       // First get total count with date filter applied
//       const [countResult]: any = await pool.query(countQuery, queryParams);
//       const total = countResult[0]?.total || 0;

//       if (total === 0) {
//         return new Response(
//           JSON.stringify({ error: "No data found for the selected date range" }),
//           { status: 404, headers: { "Content-Type": "application/json" } }
//         );
//       }

//       // Fetch all data with date filter applied
//       const [rows]: any = await pool.query(
//         `${dataQuery} ORDER BY id DESC`,
//         queryParams
//       );

//       // Create workbook
//       const workbook = XLSX.utils.book_new();
//       const worksheet = XLSX.utils.json_to_sheet(rows);
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

//       // Generate Excel file buffer
//       const excelBuffer = XLSX.write(workbook, {
//         bookType: "xlsx",
//         type: "buffer",
//       });

//       // Return the complete buffer without streaming
//       return new Response(excelBuffer, {
//         headers: {
//           "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//           "Content-Disposition": `attachment; filename="${table}_export_${fromDate || 'start'}_to_${toDate || 'end'}.xlsx"`,
//           "Content-Length": excelBuffer.length.toString(),
//           // Add cache control headers to prevent caching issues
//           "Cache-Control": "no-cache, no-store, must-revalidate",
//           "Pragma": "no-cache",
//           "Expires": "0"
//         },
//       });
//     }

//     // Normal paginated response
//     dataQuery += ` ORDER BY id DESC LIMIT ? OFFSET ?`;
//     queryParams.push(limit, offset);

//     const [countResult]: any = await pool.query(countQuery, queryParams.slice(0, -2));
//     const total = countResult[0]?.total || 0;

//     const [rows]: any = await pool.query(dataQuery, queryParams);

//     const response = {
//       table,
//       data: rows,
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//       timestampColumn: timestampColumn || null,
//       dateFilter: {
//         fromDate,
//         toDate,
//         applied: timestampColumn && (fromDate || toDate)
//       }
//     };

//     return new Response(JSON.stringify(response), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (err: any) {
//     console.error("DB fetch error:", err?.message || err);
//     return new Response(JSON.stringify({ error: "Database error" }), {
//       status: 500,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   }
// }

import { pool } from "@/lib/db";
import * as XLSX from "xlsx";

const ALLOWED_TABLES = [
  "GTPL_108_gT_40E_P_S7_200_Germany",
  "GTPL_109_gT_40E_P_S7_200_Germany",
  "GTPL_110_gT_40E_P_S7_200_Germany",
  "GTPL_111_gT_80E_P_S7_200_Germany",
  "GTPL_112_gT_80E_P_S7_200_Germany",
  "GTPL_113_gT_80E_P_S7_200_Germany",
  "kabomachinedatasmart200",
  "GTPL_114_GT_140E_S7_1200",
  "GTPL_115_GT_180E_S7_1200",
  "GTPL_119_GT_180E_S7_1200",
  "GTPL_120_GT_180E_S7_1200",
  "GTPL_116_GT_240E_S7_1200",
  "GTPL_117_GT_320E_S7_1200",
  "GTPL_121_GT1000T",
  "gtpl_122_s7_1200_01",
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table") || "kabomachinedatasmart200";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const downloadAll = searchParams.get("downloadAll") === "true";
    const limit = downloadAll ? 10000 : 100;
    const offset = (page - 1) * limit;

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

    // Check timestamp column
    let timestampColumn = '';
    try {
      const [checkLower]: any = await pool.query(
        `SHOW COLUMNS FROM \`${table}\` LIKE 'created_at'`
      );
      if (checkLower.length > 0) {
        timestampColumn = 'created_at';
      } else {
        const [checkUpper]: any = await pool.query(
          `SHOW COLUMNS FROM \`${table}\` LIKE 'created_At'`
        );
        if (checkUpper.length > 0) {
          timestampColumn = 'created_At';
        }
      }
    } catch (err) {
      console.error("Error checking timestamp columns:", err);
    }

    // Base queries
    let countQuery = `SELECT COUNT(*) as total FROM \`${table}\``;
    let dataQuery = `SELECT * FROM \`${table}\``;
    const queryParams: any[] = [];

    // Date filtering - apply to both count and data queries
    if (timestampColumn && (fromDate || toDate)) {
      let dateCondition = '';
      
      if (fromDate) {
        dateCondition += `\`${timestampColumn}\` >= ?`;
        queryParams.push(fromDate);
      }
      
      if (toDate) {
        if (fromDate) dateCondition += ' AND ';
        dateCondition += `\`${timestampColumn}\` <= ?`;
        queryParams.push(toDate);
      }

      if (dateCondition) {
        countQuery += ` WHERE ${dateCondition}`;
        dataQuery += ` WHERE ${dateCondition}`;
      }
    }

    // Handle download all with SheetJS
    if (downloadAll) {
      // First get total count with date filter applied
      const [countResult]: any = await pool.query(countQuery, queryParams);
      const total = countResult[0]?.total || 0;

      if (total === 0) {
        return new Response(
          JSON.stringify({ error: "No data found for the selected date range" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      // Fetch all data with date filter applied
      const [rows]: any = await pool.query(
        `${dataQuery} ORDER BY id DESC`,
        queryParams
      );

      // Create workbook
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      // Generate Excel file buffer
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "buffer",
      });

      // Return the complete buffer without streaming
      return new Response(excelBuffer, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${table}_export_${fromDate || 'start'}_to_${toDate || 'end'}.xlsx"`,
          "Content-Length": excelBuffer.length.toString(),
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        },
      });
    }

    // Normal paginated response - FIXED SECTION
    // Create separate arrays for count and data queries
    const countQueryParams = [...queryParams]; // Copy for count query
    const dataQueryParams = [...queryParams, limit, offset]; // Add pagination params for data query
    
    dataQuery += ` ORDER BY id DESC LIMIT ? OFFSET ?`;

    // Execute queries with correct parameters
    const [countResult]: any = await pool.query(countQuery, countQueryParams);
    const total = countResult[0]?.total || 0;

    const [rows]: any = await pool.query(dataQuery, dataQueryParams);

    // Ensure all response data is JSON serializable
    const response = {
      table: String(table),
      data: rows || [],
      total: Number(total),
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      timestampColumn: timestampColumn || null,
      dateFilter: {
        fromDate: fromDate || null,
        toDate: toDate || null,
        applied: Boolean(timestampColumn && (fromDate || toDate))
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error("DB fetch error:", err?.message || err);
    
    // Ensure error response is valid JSON
    const errorResponse = {
      error: "Database error",
      message: err?.message || "Unknown error occurred",
      timestamp: new Date().toISOString()
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}