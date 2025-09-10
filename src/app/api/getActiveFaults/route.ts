import { pool } from "@/lib/db";
import { MACHINE_CONFIG, MACHINE_NAME_ALIASES } from "@/lib/machineConfig";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Resolve machine name (with alias map)
  const rawMachineName = searchParams.get("machineName")?.trim() || "";
  const machineName = MACHINE_NAME_ALIASES[rawMachineName] || rawMachineName;

  // Optional: override table via query
  const overrideTable = searchParams.get("tableName")?.trim();

  // Pagination params - ensure proper parsing
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
  const limit = limitParam
    ? Math.min(Math.max(1, parseInt(limitParam, 10)), 2000)
    : 200;

  // Ensure page and limit are valid numbers
  if (!Number.isInteger(page) || !Number.isInteger(limit)) {
    return new Response(
      JSON.stringify({
        error: "Invalid pagination parameters",
        page: pageParam,
        limit: limitParam,
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const offset = (page - 1) * limit;

  const machineConfig =
    MACHINE_CONFIG[machineName as keyof typeof MACHINE_CONFIG];

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
    const table = overrideTable || machineConfig.table;

    console.log(
      `Fetching data for machine: ${machineName}, table: ${table}, page: ${page}, limit: ${limit}, offset: ${offset}`
    );

    // 1) Total count
    const [countRows] = (await pool.query(
      `SELECT COUNT(*) AS cnt FROM \`${table}\``
    )) as any[];
    const total: number = countRows?.[0]?.cnt ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    console.log(`Total records: ${total}, Total pages: ${totalPages}`);

    // Validate page number against total pages
    if (page > totalPages && total > 0) {
      return new Response(
        JSON.stringify({
          error: `Page ${page} does not exist. Maximum page is ${totalPages}`,
          total,
          totalPages,
          requestedPage: page,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2) Page data ordered by newest first to enable correct pagination across history
    const [rows] = (await pool.query(
      `SELECT * FROM \`${table}\` ORDER BY id DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    )) as any[];

    const data = Array.isArray(rows) ? rows : [];
    console.log(`Returned ${data.length} records for page ${page}`);

    return new Response(
      JSON.stringify({
        data,
        total,
        totalPages,
        page,
        limit,
        offset,
        machineName,
        machineType: machineConfig.type,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Error fetching logs:", err?.message || err);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch logs",
        details: err?.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
