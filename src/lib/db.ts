import mysql from "mysql2/promise";

// Extend global type (for Next.js hot reload safety)
declare global {
  // eslint-disable-next-line no-var
  var mysqlPool: mysql.Pool | undefined;
}

// Create or reuse pool (prevents multiple pools on hot reload)
export const pool =
  global.mysqlPool ||
  mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: Number(process.env.DATABASE_PORT),

    connectionLimit: 2,       // ✅ stay within shared hosting limit
    waitForConnections: true, // ✅ queue requests instead of crashing
    queueLimit: 0,            // ✅ unlimited queue
    idleTimeout: 30000,       // ✅ kill idle connections after 30s
    connectTimeout: 5000,     // ✅ timeout if can't connect in 5s (fits Vercel limit)

    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

// Save to global (prevents multiple pools in Next.js dev mode)
if (!global.mysqlPool) {
  global.mysqlPool = pool;
}

// ======================================================
// ✅ GENERIC QUERY FUNCTION — always use this!
//    Auto-releases connection back to pool immediately
// ======================================================
export async function query<T = any>(
  sql: string,
  values?: any[]
): Promise<T[]> {
  let lastError: any;
  
  // Try up to 3 times with exponential backoff
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const [rows] = await pool.query<T[] | any>(sql, values);
      
      // // Debug logging
      // if (process.env.NODE_ENV === "development") {
      //   console.log(`✅ Query executed successfully. Rows returned: ${Array.isArray(rows) ? rows.length : 0}`);
      // }
      
      // Ensure we always return an array
      return Array.isArray(rows) ? rows : [];
    } catch (error: any) {
      lastError = error;
      
      // If too many connections, wait and retry
      if (error.code === "ER_TOO_MANY_USER_CONNECTIONS" && attempt < 3) {
        const waitTime = attempt * 1000; // 1s, 2s, 3s
        // console.warn(`⚠️ Too many connections (attempt ${attempt}/3). Waiting ${waitTime}ms...`);
        await new Promise((r) => setTimeout(r, waitTime));
        continue;
      }
      
      // For other errors, fail immediately
      console.error(`❌ Query error on attempt ${attempt}:`, error.message);
      break;
    }
  }
  
  console.error("❌ DB Query Error after all retries:", lastError);
  throw lastError;
}

// ======================================================
// ✅ TRANSACTION SUPPORT
//    Use only when you need atomic multi-step operations
// ======================================================
export async function withTransaction<T>(
  callback: (conn: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release(); // 🔥 ALWAYS release
  }
}

// ======================================================
// ✅ CREATE USER TABLE IF NOT EXISTS
// ======================================================
export async function ensureUserTableExists() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS kabu_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      accountType VARCHAR(50),
      firstName VARCHAR(100),
      lastName VARCHAR(100),
      username VARCHAR(100),
      email VARCHAR(255),
      phoneNumber VARCHAR(20),
      company VARCHAR(100),
      password VARCHAR(255),
      monitorAccess TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await query(createTableSQL);
    console.log("✅ User table ensured");
  } catch (err) {
    console.error("❌ Error creating table:", err);
  }
}