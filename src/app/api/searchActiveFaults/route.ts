import { backendJson } from "@/lib/backendApi";
import { MACHINE_CONFIG, MACHINE_NAME_ALIASES } from "@/lib/machineConfig";

// Helper function to check if a value is considered "active"
function isActiveValue(value: any, machineType: string): boolean {
  if (value === undefined || value === null || value === "") {
    return false;
  }
  
  if (machineType === "S7-200") {
    // For S7-200: check for boolean or "tr"
    return (
      value === "tr" || 
      value === true || 
      value === "true" || 
      value === 1 || 
      value === "True"
    );
  } else {
    // For S7-1200: check for boolean or "1"/"true"
    return (
      value === true || 
      value === "true" || 
      value === 1 || 
      value === "1" || 
      value === "True"
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  const rawMachineName = searchParams.get("machineName")?.trim() || "";
  const machineName = MACHINE_NAME_ALIASES[rawMachineName] || rawMachineName;
  const search = searchParams.get("search")?.trim() || "";

  const machineConfig = MACHINE_CONFIG[machineName as keyof typeof MACHINE_CONFIG];

  if (!machineConfig) {
    return new Response(
      JSON.stringify({
        error: `No configuration found for machine: ${machineName}`,
        availableMachines: Object.keys(MACHINE_CONFIG),
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const table = machineConfig.table;
    const tags = machineConfig.tags;
    
    // Get paginated records from Go backend
    const paginatedResult = await backendJson(
      `/api/all700data/paginatedSmart200?table=${encodeURIComponent(table)}&page=${page}&limit=${limit}`
    );

    const rows = Array.isArray(paginatedResult.data) ? paginatedResult.data : [];
    
    // Process the records to find active faults
    const processedData = [];
    
    for (const record of rows) {
      const activeTags = [];
      
      // Check each tag in the record
      for (const tag of tags) {
        const value = (record as { [key: string]: any })[tag];
        
        // If the tag is active
        if (isActiveValue(value, machineConfig.type)) {
          // If there's a search term, only include matching tags
          if (!search || tag.toLowerCase().includes(search.toLowerCase())) {
            activeTags.push({
              tag,
              value,
              createdAt: (record as any).created_at || (record as any).createdAt || (record as any).timestamp || new Date().toISOString()
            });
          }
        }
      }
      
      // Only include records that have active tags matching the search
      if (activeTags.length > 0) {
        processedData.push({
          ...record,
          activeTags
        });
      }
    }
    
    const total = paginatedResult.total || 0;
    const totalPages = paginatedResult.totalPages || Math.max(1, Math.ceil(total / limit));

    return new Response(
      JSON.stringify({
        data: processedData,
        total,
        totalPages,
        page,
        limit,
        search,
        machineName,
        machineType: machineConfig.type,
        table
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Search active faults error:", err.message || err);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: err.message 
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}