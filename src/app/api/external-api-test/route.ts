import { type NextRequest, NextResponse } from "next/server"

// Test endpoint to check the external API structure
export async function GET(request: NextRequest) {
  try {
    const response = await fetch("https://grain-backend-1.onrender.com/api/alldata/alldata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      status: response.status,
      dataType: Array.isArray(data) ? "array" : typeof data,
      dataLength: Array.isArray(data) ? data.length : 1,
      sampleData: Array.isArray(data) ? data.slice(0, 3) : data,
      allKeys: Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : Object.keys(data),
      fetchedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        fetchedAt: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
