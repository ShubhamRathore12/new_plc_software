import { type NextRequest, NextResponse } from "next/server"

// External API URL
const EXTERNAL_API_URL = "https://grain-backend-1.onrender.com/api/alldata/alldata"

// Fallback fault codes function
function getFallbackFaultCodes() {
  return [
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
    { code: 13, description: "Cond Fan circuit breaker fault", created_at: new Date().toISOString() },
    { code: 14, description: "Low pressure fault : Locked", created_at: new Date().toISOString() },
    { code: 15, description: "Anti Freeze Protection", created_at: new Date().toISOString() },
    { code: 16, description: "High pressure fault : Locked", created_at: new Date().toISOString() },
    { code: 17, description: "Ambient temp. Over 40°C", created_at: new Date().toISOString() },
    { code: 18, description: "Ambient temp. Less than 4°C", created_at: new Date().toISOString() },
    { code: 19, description: "Cond Fan TOP", created_at: new Date().toISOString() },
    { code: 23, description: "Ambient Temp Sensor T2 Open", created_at: new Date().toISOString() },
    { code: 24, description: "Ambient Temp Sensor T2 Short Circuit", created_at: new Date().toISOString() },
    { code: 27, description: "Air Outlet Temp Sensor T0 Open", created_at: new Date().toISOString() },
    { code: 28, description: "Air Outlet Temp Sensor T0 Short Circuit", created_at: new Date().toISOString() },
    { code: 31, description: "Cold Air Temp Sensor T1 Open", created_at: new Date().toISOString() },
    { code: 32, description: "Cold Air Temp Sensor T1 short circuit", created_at: new Date().toISOString() },
    { code: 35, description: "Air After Heater Temp Sensor TH Open", created_at: new Date().toISOString() },
    { code: 36, description: "Air After Heater Temp Sensor TH short circuit", created_at: new Date().toISOString() },
    { code: 39, description: "High Pressure Fault", created_at: new Date().toISOString() },
    { code: 41, description: "Heater TOP fault", created_at: new Date().toISOString() },
    { code: 44, description: "TH Air After Heater Temp more than 50 °C", created_at: new Date().toISOString() },
    {
      code: 45,
      description: "Warning : Delta value not achieved in aeration mode",
      created_at: new Date().toISOString(),
    },
    { code: 48, description: "Warning : LP transducer failure", created_at: new Date().toISOString() },
    { code: 49, description: "Warning : HP transducer failure", created_at: new Date().toISOString() },
  ]
}

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching from external API:", EXTERNAL_API_URL)

    // Fetch data from external API
    const response = await fetch(EXTERNAL_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`External API responded with status: ${response.status}`)
    }

    const externalData = await response.json()
    console.log("External API Response received:", {
      type: Array.isArray(externalData) ? "array" : typeof externalData,
      length: Array.isArray(externalData) ? externalData.length : 1,
      sample: Array.isArray(externalData) ? externalData.slice(0, 2) : externalData,
    })

    // Transform external API data to fault codes format
    let faultCodes:any = []

    if (Array.isArray(externalData)) {
      // If the response is an array, map each item to fault code format
      faultCodes = externalData.map((item, index) => {
        // Extract all possible field names and create a comprehensive fault code object
        const faultCode = {
          code: item.fault_code || item.code || item.id || item.faultCode || index + 1,
          description:
            item.fault_description ||
            item.description ||
            item.message ||
            item.name ||
            item.title ||
            `Fault from API ${index + 1}`,
          timestamp: item.created_at || item.timestamp || item.date || item.updated_at || new Date().toISOString(),
          // Include all tag data from the API response
          tags: {},
          originalData: item,
        }

        // Extract all boolean/tag fields from the API response
        Object.keys(item).forEach((key) => {
          if (
            typeof item[key] === "boolean" ||
            item[key] === "true" ||
            item[key] === "false" ||
            item[key] === 1 ||
            item[key] === 0
          ) {
            (faultCode.tags as Record<string, unknown>)[key] = item[key]
          }
        })

        return faultCode
      })
    } else if (externalData && typeof externalData === "object") {
      // Handle nested data structures
      let dataArray = []

      if (externalData.data && Array.isArray(externalData.data)) {
        dataArray = externalData.data
      } else if (externalData.faults && Array.isArray(externalData.faults)) {
        dataArray = externalData.faults
      } else if (externalData.results && Array.isArray(externalData.results)) {
        dataArray = externalData.results
      } else {
        // Single object response
        dataArray = [externalData]
      }

      faultCodes = dataArray.map((item:any, index:any) => {
        const faultCode = {
          code: item.fault_code || item.code || item.id || item.faultCode || index + 1,
          description:
            item.fault_description ||
            item.description ||
            item.message ||
            item.name ||
            item.title ||
            `Fault from API ${index + 1}`,
          timestamp: item.created_at || item.timestamp || item.date || item.updated_at || new Date().toISOString(),
          tags: {},
          originalData: item,
        }

        // Extract all tag fields
        Object.keys(item).forEach((key) => {
          if (
            typeof item[key] === "boolean" ||
            item[key] === "true" ||
            item[key] === "false" ||
            item[key] === 1 ||
            item[key] === 0
          ) {
            (faultCode.tags as Record<string, unknown>)[key] = item[key]
          }
        })

        return faultCode
      })
    }

    // If no fault codes found, use fallback data
    if (faultCodes.length === 0) {
      console.log("No fault codes found in API response, using fallback data")
      faultCodes = getFallbackFaultCodes()
    }

    console.log(`Returning ${faultCodes.length} fault codes`)

    return NextResponse.json({
      faultCodes,
      source: "external_api",
      count: faultCodes.length,
      apiUrl: EXTERNAL_API_URL,
      fetchedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("External API fetch error:", error)

    // Return fallback data in case of error
    const fallbackFaultCodes = getFallbackFaultCodes()

    return NextResponse.json(
      {
        faultCodes: fallbackFaultCodes,
        source: "fallback",
        error: error instanceof Error ? error.message : "Failed to fetch from external API",
        apiUrl: EXTERNAL_API_URL,
        fetchedAt: new Date().toISOString(),
      },
      { status: 200 },
    )
  }
}
