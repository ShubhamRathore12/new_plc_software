import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function ensureUserTableExists() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS kanaban_user (
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

  const connection = await pool.getConnection();
  try {
    await connection.query(createTableSQL);
  } finally {
    connection.release();
  }
}
