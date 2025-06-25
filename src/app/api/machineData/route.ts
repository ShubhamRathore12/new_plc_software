import type { NextApiRequest, NextApiResponse } from "next";
import { pool } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;

  const type = query.type as string;

  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const offset = (page - 1) * limit;
  const from = query.from as string | undefined;
  const to = query.to as string | undefined;

  let filters = "";
  const params: (string | number)[] = [];

  if (from && to) {
    filters = "WHERE date_column BETWEEN ? AND ?";
    params.push(from, to);
  } else if (from) {
    filters = "WHERE date_column >= ?";
    params.push(from);
  } else if (to) {
    filters = "WHERE date_column <= ?";
    params.push(to);
  }

  try {
    if (method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (type === "getAllDataSmart200") {
      const [rows] = await pool.query(
        "SELECT * FROM kabomachinedatasmart200 ORDER BY id DESC LIMIT 100"
      );
      return res.status(200).json(rows);
    }

    if (type === "getAllDataSmart1200") {
      const [rows] = await pool.query(
        "SELECT * FROM gtpl_122_s7_1200_01 ORDER BY id DESC LIMIT 100"
      );
      return res.status(200).json(rows);
    }

    if (type === "paginatedSmart200") {
      const [countRows] = await pool.query(
        `SELECT COUNT(*) as total FROM kabomachinedatasmart200 ${filters}`,
        params
      );
      const total = (countRows as any)[0]?.total || 0;

      const [rows] = await pool.query(
        `SELECT * FROM kabomachinedatasmart200 ${filters} ORDER BY id DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      return res.status(200).json({
        data: rows,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      });
    }

    if (type === "paginatedSmart1200") {
      const [countRows] = await pool.query(
        `SELECT COUNT(*) as total FROM gtpl_122_s7_1200_01 ${filters}`,
        params
      );
      const total = (countRows as any)[0]?.total || 0;

      const [rows] = await pool.query(
        `SELECT * FROM gtpl_122_s7_1200_01 ${filters} ORDER BY id DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      return res.status(200).json({
        data: rows,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      });
    }

    return res.status(400).json({ error: "Invalid type" });
  } catch (err: any) {
    console.error("Error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}
