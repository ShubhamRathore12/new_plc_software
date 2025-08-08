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

// More flexible limits - allow larger downloads but with warnings
const MAX_RECORDS_DOWNLOAD = 50000; // Increased limit
const BATCH_SIZE = 1000;
const QUERY_TIMEOUT = 10000; // 10 seconds max per query

export async function GET(req: Request) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table") || "kabomachinedatasmart200";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const downloadAll = searchParams.get("downloadAll") === "true";
    const forceLargeDownload = searchParams.get("forceLarge") === "true"; // New parameter
    const limit = downloadAll ? MAX_RECORDS_DOWNLOAD : 100;
    const offset = (page - 1) * limit;

    console.log(`[${Date.now() - startTime}ms] Starting request for table: ${table}`);

    // Validate table name
    if (!ALLOWED_TABLES.includes(table)) {
      return Response.json({
        error: "Invalid table name",
        allowedTables: ALLOWED_TABLES,
      }, { status: 400 });
    }

    // Quick check if table exists and get timestamp column
    let timestampColumn = "";
    try {
      // Skip column check to save time - assume created_at exists
      timestampColumn = "created_at";
    } catch (err) {
      console.warn("Using default timestamp column");
    }

    console.log(`[${Date.now() - startTime}ms] Timestamp column: ${timestampColumn}`);

    // Build queries
    let baseQuery = `FROM \`${table}\``;
    const queryParams: any[] = [];

    // Add date filtering - force recent data if no date filter
    if (timestampColumn && (fromDate || toDate)) {
      const conditions: string[] = [];
      
      if (fromDate) {
        conditions.push(`\`${timestampColumn}\` >= ?`);
        queryParams.push(fromDate);
      }
      
      if (toDate) {
        conditions.push(`\`${timestampColumn}\` <= ?`);
        queryParams.push(toDate);
      }

      if (conditions.length > 0) {
        baseQuery += ` WHERE ${conditions.join(' AND ')}`;
      }
    } else if (timestampColumn && downloadAll) {
      // For downloads without date filter, suggest but don't force date filtering
      console.log(`[${Date.now() - startTime}ms] Download all requested - no date filter applied`);
    }

    // Handle Excel download with timeout protection
    if (downloadAll) {
      try {
        console.log(`[${Date.now() - startTime}ms] Starting download process`);
        
        // Quick count check with very short timeout
        const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
        const countResult = await Promise.race([
          pool.query(countQuery, queryParams),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Count query timeout')), QUERY_TIMEOUT)
          )
        ]);

        const countData = Array.isArray(countResult) ? countResult[0] : countResult;
        const totalRows = Array.isArray(countData) && countData.length > 0 ? countData[0] : { total: 0 };
        const total = Number(totalRows.total) || 0;

        console.log(`[${Date.now() - startTime}ms] Total records: ${total}`);

        if (total === 0) {
          return Response.json({
            error: "No data found",
            table: table,
            dateFilter: { fromDate, toDate }
          }, { status: 404 });
        }

        if (total > MAX_RECORDS_DOWNLOAD && !forceLargeDownload) {
          return Response.json({
            error: `Large dataset detected (${total} records)`,
            suggestion: "Consider using date filters to reduce data size for better performance",
            maxAllowed: MAX_RECORDS_DOWNLOAD,
            downloadUrl: `${req.url}&forceLarge=true`, // Provide bypass URL
            warning: "Large downloads may take several minutes and consume significant memory",
            estimatedTime: `${Math.ceil(total / 1000)} seconds`
          }, { status: 400 });
        }

        // Warn for large datasets but allow download
        if (total > 5000) {
          console.log(`[${Date.now() - startTime}ms] Warning: Large dataset (${total} records)${forceLargeDownload ? ' - FORCED' : ''}`);
        }

        // For very large datasets, use a more efficient query
        let dataQuery;
        if (total > 10000) {
          // Use simpler query for large datasets
          dataQuery = `SELECT * ${baseQuery} ORDER BY id DESC LIMIT ${total}`;
        } else {
          dataQuery = `SELECT * ${baseQuery} ORDER BY id DESC LIMIT ${Math.min(total, MAX_RECORDS_DOWNLOAD)}`;
        }
        
        console.log(`[${Date.now() - startTime}ms] Executing data query`);
        
        const dataResult = await Promise.race([
          pool.query(dataQuery, queryParams),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Data query timeout')), Math.max(QUERY_TIMEOUT, total > 5000 ? 30000 : 10000))
          )
        ]);

        const rows = Array.isArray(dataResult) ? dataResult[0] : dataResult;

        if (!Array.isArray(rows) || rows.length === 0) {
          return Response.json({
            error: "No data records found"
          }, { status: 404 });
        }

        console.log(`[${Date.now() - startTime}ms] Processing ${rows.length} rows`);

        // Fast data processing - no complex transformations
        const processedData = rows.map((row: any) => {
          const newRow: any = {};
          for (const [key, value] of Object.entries(row)) {
            if (value === null || value === undefined) {
              newRow[key] = "";
            } else if (value instanceof Date) {
              newRow[key] = value.toISOString().slice(0, 19).replace('T', ' ');
            } else {
              newRow[key] = String(value);
            }
          }
          return newRow;
        });

        console.log(`[${Date.now() - startTime}ms] Creating Excel file`);

        // Minimal Excel generation
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(processedData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "buffer"
        });

        console.log(`[${Date.now() - startTime}ms] Excel file generated: ${excelBuffer.length} bytes`);

        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `${table}_${timestamp}.xlsx`;

        return new Response(excelBuffer, {
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Length": String(excelBuffer.length),
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });

      } catch (downloadError) {
        console.error(`[${Date.now() - startTime}ms] Download failed:`, downloadError);
        
        const errorMessage = downloadError instanceof Error ? downloadError.message : String(downloadError);
        
        if (errorMessage.includes('timeout')) {
          return Response.json({
            error: "Request timeout - too much data to process",
            suggestion: "Please try with a smaller date range or contact support",
            processingTime: `${Date.now() - startTime}ms`
          }, { status: 408 });
        }

        return Response.json({
          error: "Download failed",
          details: errorMessage,
          processingTime: `${Date.now() - startTime}ms`
        }, { status: 500 });
      }
    }

    // Regular paginated response with timeout protection
    try {
      console.log(`[${Date.now() - startTime}ms] Getting paginated data`);

      // Get count and data in parallel with very short timeout
      const [countResult, dataResult] = await Promise.all([
        Promise.race([
          pool.query(`SELECT COUNT(*) as total ${baseQuery}`, queryParams),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Count timeout')), QUERY_TIMEOUT))
        ]),
        Promise.race([
          pool.query(`SELECT * ${baseQuery} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`, queryParams),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Data timeout')), QUERY_TIMEOUT))
        ])
      ]);

      const countData = Array.isArray(countResult) ? countResult[0] : countResult;
      const totalRows = Array.isArray(countData) && countData.length > 0 ? countData[0] : { total: 0 };
      const total = Number(totalRows.total) || 0;

      const rows = Array.isArray(dataResult) ? dataResult[0] : dataResult;

      console.log(`[${Date.now() - startTime}ms] Returning paginated response`);

      return Response.json({
        table: table,
        data: Array.isArray(rows) ? rows : [],
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
        timestampColumn: timestampColumn || null,
        dateFilter: {
          fromDate: fromDate || null,
          toDate: toDate || null,
          applied: Boolean(timestampColumn && (fromDate || toDate))
        },
        processingTime: `${Date.now() - startTime}ms`
      });

    } catch (queryError) {
      console.error(`[${Date.now() - startTime}ms] Query failed:`, queryError);
      
      const errorMessage = queryError instanceof Error ? queryError.message : String(queryError);
      
      return Response.json({
        error: "Database query failed",
        details: errorMessage,
        processingTime: `${Date.now() - startTime}ms`
      }, { status: 500 });
    }

  } catch (err: any) {
    console.error(`[${Date.now() - startTime}ms] General error:`, err);
    
    return Response.json({
      error: "Internal server error",
      message: err?.message || "Unknown error",
      processingTime: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Add OPTIONS handler for CORS
export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}