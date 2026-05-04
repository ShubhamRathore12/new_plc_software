import { type NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"

// External API URL
const EXTERNAL_API_URL = (process.env.BACKEND_URL || "https://www.primeosys.com/backend") + "/api/alldata/alldata"

export async function POST(request: NextRequest) {
  try {
    const { modelType, period, faultCodes, activeTags, currentView } = await request.json()

    console.log("Export request received:", { modelType, period, currentView })

    // Fetch fresh data from external API for S7-200
    let apiData = []
    if (modelType === "S7-200") {
      try {
        const response = await fetch(EXTERNAL_API_URL, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        })

        if (response.ok) {
          const externalData = await response.json()
          console.log("Fresh API data fetched for export")

          // Transform API data
          if (Array.isArray(externalData)) {
            apiData = externalData
          } else if (externalData && typeof externalData === "object") {
            if (externalData.data && Array.isArray(externalData.data)) {
              apiData = externalData.data
            } else if (externalData.faults && Array.isArray(externalData.faults)) {
              apiData = externalData.faults
            } else {
              apiData = [externalData]
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch fresh API data for export:", error)
      }
    }

    // Create a new workbook
    const workbook = XLSX.utils.book_new()

    // Create fault codes worksheet
    const faultCodesData = [
      ["Fault Code", "Description", "Model Type", "Export Date", "Time Period", "Timestamp"],
      ...faultCodes.map((fault: any) => [
        fault.code || "N/A",
        fault.description || "N/A",
        modelType,
        new Date().toLocaleString(),
        period,
        fault.timestamp || fault.created_at || new Date().toISOString(),
      ]),
    ]

    const faultCodesWorksheet = XLSX.utils.aoa_to_sheet(faultCodesData)
    XLSX.utils.book_append_sheet(workbook, faultCodesWorksheet, "Fault Codes")

    // Create API data worksheet if we have S7-200 data
    if (modelType === "S7-200" && apiData.length > 0) {
      // Get all unique keys from the API data
      const allKeys = new Set()
      apiData.forEach((item:any) => {
        Object.keys(item).forEach((key) => allKeys.add(key))
      })

      const headers = Array.from(allKeys)
      const apiDataSheet = [
        headers,
        ...apiData.map((item: any) =>
          headers.map((header:any) => {
            const value = item[header]
            if (value === null || value === undefined) return "N/A"
            if (typeof value === "boolean") return value ? "TRUE" : "FALSE"
            if (typeof value === "object") return JSON.stringify(value)
            return String(value)
          }),
        ),
      ]

      const apiWorksheet = XLSX.utils.aoa_to_sheet(apiDataSheet)
      XLSX.utils.book_append_sheet(workbook, apiWorksheet, "API Raw Data")
    }

    // Create active tags worksheet if there are active tags
    if (activeTags && activeTags.length > 0) {
      const activeTagsData = [
        ["Tag Name", "Status", "Value", "Model Type", "Export Date", "Time Period"],
        ...activeTags.map((tag: any) => [
          tag.tag || "N/A",
          "Active",
          tag.value === true || tag.value === "true" || tag.value === 1
            ? "TRUE"
            : tag.value === false || tag.value === "false" || tag.value === 0
              ? "FALSE"
              : String(tag.value || "N/A"),
          modelType,
          new Date().toLocaleString(),
          period,
        ]),
      ]

      const activeTagsWorksheet = XLSX.utils.aoa_to_sheet(activeTagsData)
      XLSX.utils.book_append_sheet(workbook, activeTagsWorksheet, "Active Tags")
    }

    // Create summary worksheet
    const summaryData = [
      ["Export Summary"],
      ["Model Type", modelType],
      ["Time Period", period],
      ["Export Date", new Date().toLocaleString()],
      ["Total Fault Codes", faultCodes.length],
      ["Active Tags Count", activeTags ? activeTags.length : 0],
      ["Current View", currentView],
      ["API Data Records", apiData.length],
      ["Data Source", apiData.length > 0 ? "External API" : "Local Data"],
      [],
      ["Time Period Definitions"],
      ["lastWeek", "Data from the last 7 days"],
      ["lastMonth", "Data from the last 30 days"],
      ["last2Months", "Data from the last 60 days"],
      ["all", "All available data"],
    ]

    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Summary")

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
      cellStyles: true,
    })

    console.log("Excel file generated successfully")

    // Create response with proper headers
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="fault-data-${modelType}-${period}-${new Date().toISOString().split("T")[0]}.xlsx"`,
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
