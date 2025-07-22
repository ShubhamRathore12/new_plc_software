import { pool } from "@/lib/db";
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

    // Get machine name
    const rawMachineName = searchParams.get("machineName")?.trim() || "";
    const machineName = MACHINE_NAME_ALIASES[rawMachineName] || rawMachineName;

    // Get search term
    const search = searchParams.get("search")?.trim() || "";

    // Get machine configuration
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
        const machineType = machineConfig.type;

        // Get records for this machine (limit to 1000 for performance)
        const [records] = await pool.query(
            `SELECT * FROM \`${table}\` ORDER BY id DESC LIMIT 1000`
        );

        if (!Array.isArray(records) || records.length === 0) {
            return new Response(
                JSON.stringify({
                    data: [],
                    message: `No records found for machine: ${machineName}`,
                }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }

        // Process all records to find active tags
        const allActiveTags: any[] = [];
        const processedRecords: any[] = [];

        for (const record of records as any[]) {
            const recordActiveTags = [];

            // Check each tag in the record
            for (const tag of tags) {
                const value = record[tag];

                if (isActiveValue(value, machineType)) {
                    // If search is provided, only include tags that match the search term
                    if (!search || tag.toLowerCase().includes(search.toLowerCase())) {
                        const tagData = {
                            tag,
                            value,
                            createdAt: record.created_at ||
                                record.createdAt ||
                                record.timestamp ||
                                new Date().toISOString()
                        };

                        recordActiveTags.push(tagData);
                        allActiveTags.push(tagData);
                    }
                }
            }

            // Only include records with active tags
            if (recordActiveTags.length > 0) {
                processedRecords.push({
                    ...record,
                    activeTags: recordActiveTags
                });
            }
        }

        return new Response(
            JSON.stringify({
                data: processedRecords,
                activeTags: allActiveTags,
                total: processedRecords.length,
                totalActiveTags: allActiveTags.length,
                machineName,
                machineType,
                search: search || null,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err: any) {
        console.error("Error fetching active faults:", err.message || err);
        return new Response(
            JSON.stringify({
                error: "Failed to fetch active faults",
                details: err.message
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}