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
    const limit = downloadAll ? 50000 : 100; // Increased limit for download
    const offset = (page - 1) * limit;

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

    // Check timestamp column
    let timestampColumn = "";
    try {
      const checkLowerResult = await pool.query(
        `SHOW COLUMNS FROM \`${table}\` LIKE 'created_at'`
      );
      const checkLower = Array.isArray(checkLowerResult) ? checkLowerResult[0] : checkLowerResult;
      
      if (checkLower && Array.isArray(checkLower) && checkLower.length > 0) {
        timestampColumn = "created_at";
      } else {
        const checkUpperResult = await pool.query(
          `SHOW COLUMNS FROM \`${table}\` LIKE 'created_At'`
        );
        const checkUpper = Array.isArray(checkUpperResult) ? checkUpperResult[0] : checkUpperResult;
        
        if (checkUpper && Array.isArray(checkUpper) && checkUpper.length > 0) {
          timestampColumn = "created_At";
        }
      }
    } catch (err) {
      console.error("Error checking timestamp columns:", err);
    }

    // Build queries
    let countQuery = `SELECT COUNT(*) as total FROM \`${table}\``;
    let dataQuery = `SELECT * FROM \`${table}\``;
    const queryParams: string[] = [];

    // Add date filtering
    if (timestampColumn && (fromDate || toDate)) {
      const dateConditions: string[] = [];
      
      if (fromDate) {
        dateConditions.push(`\`${timestampColumn}\` >= ?`);
        queryParams.push(fromDate);
      }
      
      if (toDate) {
        dateConditions.push(`\`${timestampColumn}\` <= ?`);
        queryParams.push(toDate);
      }

      if (dateConditions.length > 0) {
        const whereClause = ` WHERE ${dateConditions.join(" AND ")}`;
        countQuery += whereClause;
        dataQuery += whereClause;
      }
    }

    // Handle Excel download
    if (downloadAll) {
      try {
        // Get total count
        const countResult = await pool.query(countQuery, queryParams);
        const countData = Array.isArray(countResult) ? countResult[0] : countResult;
        const totalRows:any = Array.isArray(countData) && countData.length > 0 ? countData[0] : { total: 0 };
        const total =  totalRows.total ;

        if (total === 0) {
          return new Response(
            JSON.stringify({ error: "No data found for the selected date range" }),
            { 
              status: 404, 
              headers: { "Content-Type": "application/json" } 
            }
          );
        }

        // Fetch data
        const dataResult = await pool.query(
          `${dataQuery} ORDER BY id DESC LIMIT ${limit}`,
          queryParams
        );
        const rows = Array.isArray(dataResult) ? dataResult[0] : dataResult;

        if (!Array.isArray(rows) || rows.length === 0) {
          return new Response(
            JSON.stringify({ error: "No data found" }),
            { 
              status: 404, 
              headers: { "Content-Type": "application/json" } 
            }
          );
        }

        // Process data for Excel
        const processedData = rows.map((row: any) => {
          const processedRow: any = {};
          
          for (const key in row) {
            if (row.hasOwnProperty(key)) {
              const value = row[key];
              
              if (value === null || value === undefined) {
                processedRow[key] = "";
              } else if (typeof value === "boolean") {
                processedRow[key] = value ? "TRUE" : "FALSE";
              } else if (value instanceof Date) {
                processedRow[key] = value.toISOString().replace("T", " ").substring(0, 19);
              } else if (typeof value === "number") {
                processedRow[key] = value;
              } else {
                processedRow[key] = String(value);
              }
            }
          }
          
          return processedRow;
        });

        // Create Excel file
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(processedData);
        
        // Set column widths
        if (processedData.length > 0) {
          const columnKeys = Object.keys(processedData[0]);
          const columnWidths = columnKeys.map(key => {
            const maxLength = Math.max(
              key.length,
              ...processedData.slice(0, 100).map(row => String(row[key] || "").length)
            );
            return { wch: Math.min(Math.max(maxLength + 2, 10), 50) };
          });
          worksheet["!cols"] = columnWidths;
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        // Generate file
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "buffer"
        });

        // Create filename
        const timestamp = new Date().toISOString().split("T")[0];
        const dateRange = `${fromDate || "start"}_to_${toDate || "end"}`;
        const filename = `${table}_export_${dateRange}_${timestamp}.xlsx`;

        return new Response(excelBuffer, {
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Length": excelBuffer.length.toString(),
          },
        });

      } catch (downloadError) {
        console.error("Download error:", downloadError);
        return new Response(
          JSON.stringify({ 
            error: "Failed to generate Excel file",
            details: String(downloadError)
          }),
          { 
            status: 500, 
            headers: { "Content-Type": "application/json" } 
          }
        );
      }
    }

    // Regular paginated response
    try {
      // Get count
      const countResult = await pool.query(countQuery, queryParams);
      const countData = Array.isArray(countResult) ? countResult[0] : countResult;
      const totalRows:any = Array.isArray(countData) && countData.length > 0 ? countData[0] : { total: 0 };
      const total:any = totalRows.total || 0;

      // Get paginated data
      const paginatedQuery = `${dataQuery} ORDER BY id DESC LIMIT ? OFFSET ?`;
      const paginatedParams = [...queryParams, limit, offset];
      
      const dataResult = await pool.query(paginatedQuery, paginatedParams);
      const rows = Array.isArray(dataResult) ? dataResult[0] : dataResult;

      const response = {
        table: table,
        data: Array.isArray(rows) ? rows : [],
        total: Number(total),
        page: page,
        limit: limit,
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

    } catch (queryError) {
      console.error("Query error:", queryError);
      return new Response(
        JSON.stringify({ 
          error: "Database query failed",
          details: String(queryError)
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

  } catch (err: any) {
    console.error("General error:", err);
    
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: err?.message || "Unknown error occurred",
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}