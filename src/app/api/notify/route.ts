// app/api/notify/route.ts

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { Twilio } from "twilio";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, subject, message, phone, smsMessage } = body;

    if (!email || !subject || !message || !phone || !smsMessage) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // --- Send Email using nodemailer (Ethereal Test Account) ---
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const emailInfo = await transporter.sendMail({
      from: '"Sender Name" <sender@example.com>',
      to: email,
      subject,
      text: message,
      html: `<p>${message}</p>`,
    });

    console.log("Email sent:", emailInfo.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(emailInfo));

    // --- Send SMS using Twilio ---
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE;

    if (!accountSid || !authToken || !twilioPhone) {
      throw new Error("Twilio environment variables are not set.");
    }

    const client = new Twilio(accountSid, authToken);
    const sms = await client.messages.create({
      body: smsMessage,
      from: twilioPhone,
      to: phone,
    });

    console.log("SMS sent:", sms.sid);

    return NextResponse.json(
      { message: "Notification sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      {
        error: "Error sending notification",
        details: (error as Error).toString(),
      },
      { status: 500 }
    );
  }
}
