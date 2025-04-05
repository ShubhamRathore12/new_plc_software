import { NextResponse } from "next/server";
import { pool, ensureUserTableExists } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    accountType,
    firstName,
    lastName,
    username,
    email,
    phoneNumber,
    company,
    password,
    monitorAccess,
  } = body;

  try {
    await ensureUserTableExists();

    const monitorAccessStr = Array.isArray(monitorAccess)
      ? monitorAccess.join(",")
      : "";

    await pool.query(
      `INSERT INTO kanaban_user 
       (accountType, firstName, lastName, username, email, phoneNumber, company, password, monitorAccess) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        accountType,
        firstName,
        lastName,
        username,
        email || null,
        phoneNumber,
        company,
        password,
        monitorAccessStr,
      ]
    );

    if (email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_FROM,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Welcome to Kanaban!",
        html: `<p>Hello ${firstName},<br>Your account has been successfully created.</p>`,
      });
    }

    return NextResponse.json({ message: "User registered and email sent" });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 }
    );
  }
}

// 👇 Optional: handle other methods
