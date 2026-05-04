import { type NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"

// External API URL
const EXTERNAL_API_URL = (process.env.BACKEND_URL || "https://www.primeosys.com/backend") + "/api/alldata/alldata"

export async function POST(request: NextRequest) {
  try {
    const { period } = await request.json()

    // Fetch data from external API
    const response = await fetch(EXTERNAL_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    let rows: any[] = []

    if (response.ok) {
      const externalData = await response.json()
      console.log("External API Data for Excel:", externalData)

      // Transform external API data
      if (Array.isArray(externalData)) {
        rows = externalData
      } else if (externalData && typeof externalData === "object") {
        if (externalData.data && Array.isArray(externalData.data)) {
          rows = externalData.data
        } else if (externalData.faults && Array.isArray(externalData.faults)) {
          rows = externalData.faults
        } else {
          rows = [externalData]
        }
      }

      // Filter by time period if specified
      if (period && period !== "all" && rows.length > 0) {
        const now = new Date()
        const startDate = new Date()

        switch (period) {
          case "lastWeek":
            startDate.setDate(now.getDate() - 7)
            break
          case "lastMonth":
            startDate.setMonth(now.getMonth() - 1)
            break
          case "last2Months":
            startDate.setMonth(now.getMonth() - 2)
            break
        }

        // Filter rows based on timestamp
        rows = rows.filter((row) => {
          const rowDate = new Date(row.created_at || row.timestamp || row.date || new Date())
          return rowDate >= startDate
        })
      }
    } else {
      // Fallback data if API fails
      rows = [
        { code: 1, description: "Compressor circuit breaker fault", created_at: new Date().toISOString() },
        { code: 2, description: "Condenser fan door open", created_at: new Date().toISOString() },
        { code: 3, description: "Blower drive fault", created_at: new Date().toISOString() },
        { code: 4, description: "Blower circuit breaker fault", created_at: new Date().toISOString() },
        { code: 6, description: "Heater circuit breaker fault", created_at: new Date().toISOString() },
        { code: 7, description: "Three phase monitor fault", created_at: new Date().toISOString() },
        { code: 8, description: "Low Pressure Fault", created_at: new Date().toISOString() },
        { code: 9, description: "Ambient temp lower than set temp", created_at: new Date().toISOString() },
        { code: 10, description: "Ambient temp. Over 43°C", created_at: new Date().toISOString() },
        { code: 12, description: "Heater RCCB fault", created_at: new Date().toISOString() },
      ]
    }

    // Create Excel workbook
    const workbook = XLSX.utils.book_new()

    // Prepare data for Excel - include all fields from API response
    const excelHeaders = ["Fault Code", "Description", "Timestamp", "Export Date", "Time Period"]

    // Add additional headers based on the first row's keys
    if (rows.length > 0) {
      const firstRow = rows[0]
      const additionalHeaders = Object.keys(firstRow).filter(
        (key) =>
          !["fault_code", "code", "fault_description", "description", "created_at", "timestamp", "date"].includes(key),
      )
      excelHeaders.push(...additionalHeaders)
    }

    const excelData = [
      excelHeaders,
      ...rows.map((row: any) => {
        const baseData = [
          row.fault_code || row.code || "N/A",
          row.fault_description || row.description || row.message || "N/A",
          row.created_at || row.timestamp || row.date || new Date().toISOString(),
          new Date().toLocaleString(),
          period || "all",
        ]

        // Add additional data fields
        const additionalData = Object.keys(row)
          .filter(
            (key) =>
              !["fault_code", "code", "fault_description", "description", "created_at", "timestamp", "date"].includes(
                key,
              ),
          )
          .map((key) => row[key])

        return [...baseData, ...additionalData]
      }),
    ]

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(excelData)

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "S7-200 External API Data")

    // Create summary sheet
    const summaryData = [
      ["S7-200 External API Data Export Summary"],
      ["API URL", EXTERNAL_API_URL],
      ["Export Date", new Date().toLocaleString()],
      ["Time Period", period || "all"],
      ["Total Records", rows.length],
      ["Data Source", response.ok ? "External API" : "Fallback Data"],
    ]

    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Export Summary")

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
      cellStyles: true,
    })

    // Return Excel file
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="s7-200-external-api-data-${period || "all"}-${new Date().toISOString().split("T")[0]}.xlsx"`,
        "Content-Length": excelBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("Excel export error:", error)
    return NextResponse.json(
      { 
        error: "Failed to generate Excel file", 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}
