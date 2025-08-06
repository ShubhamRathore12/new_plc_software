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

    // Handle Excel download with proper formatting
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

      // Process data for Excel formatting
      const processedData = rows.map((row: any) => {
        const processedRow: any = {};
        
        Object.keys(row).forEach(key => {
          let value = row[key];
          
          // Handle different data types properly
          if (value === null || value === undefined) {
            processedRow[key] = "";
          } else if (typeof value === 'boolean') {
            processedRow[key] = value ? "TRUE" : "FALSE";
          } else if (value instanceof Date) {
            // Format dates properly
            processedRow[key] = value.toISOString().split('T')[0] + ' ' + 
                               value.toTimeString().split(' ')[0];
          } else if (typeof value === 'number') {
            // Preserve numbers as numbers for Excel calculations
            processedRow[key] = value;
          } else if (typeof value === 'string') {
            // Clean strings and preserve text formatting
            processedRow[key] = value.trim();
          } else {
            // Convert other types to string
            processedRow[key] = String(value);
          }
        });
        
        return processedRow;
      });

      // Create workbook with proper formatting
      const workbook = XLSX.utils.book_new();
      
      // Convert to worksheet with proper column widths
      const worksheet = XLSX.utils.json_to_sheet(processedData);
      
      // Auto-size columns based on content
      const columnWidths: any = {};
      processedData.forEach((row: any) => {
        Object.keys(row).forEach(key => {
          const value = String(row[key] || '');
          const currentWidth = columnWidths[key] || 10;
          columnWidths[key] = Math.max(currentWidth, Math.min(value.length + 2, 50));
        });
      });
      
      // Apply column widths
      const cols = Object.keys(columnWidths).map(key => ({ wch: columnWidths[key] }));
      worksheet['!cols'] = cols;
      
      // Set worksheet properties
      worksheet['!autofilter'] = { ref: XLSX.utils.encode_range({
        s: { c: 0, r: 0 },
        e: { c: Object.keys(processedData[0] || {}).length - 1, r: processedData.length }
      })};

      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      // Generate Excel file buffer with proper formatting options
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "buffer",
        cellStyles: true,
     
        cellDates: true
      });

      // Create filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${table}_export_${fromDate || 'start'}_to_${toDate || 'end'}_${timestamp}.xlsx`;

      return new Response(excelBuffer, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": excelBuffer.length.toString(),
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        },
      });
    }

    // Paginated response
    const countQueryParams = [...queryParams];
    const dataQueryParams = [...queryParams, limit, offset];
    
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