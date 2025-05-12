import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",       
      user: "myshaa_iotdatatest",               
      password: "j5f8%JUqUk_",  
      database: "myshaa_iotdatatest",  
    });

    const [rows]: any = await connection.execute(
      "SELECT * FROM myshaa_iotdatatest ORDER BY id DESC LIMIT 100"
    );

    await connection.end();

    return NextResponse.json(rows, { status: 200 });

  } catch (err: any) {
    console.error("DB fetch error:", err?.message || err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
