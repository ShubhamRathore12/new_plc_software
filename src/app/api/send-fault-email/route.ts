import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createFaultEmailTemplate } from "@/lib/email-templates";

export async function POST(request: Request) {
  try {
    const { machineName, fault } = await request.json();

    if (!machineName || !fault || !fault.tag || !fault.description) {
      return NextResponse.json(
        { message: "Missing required fields: machineName or fault details" },
        { status: 400 }
      );
    }

    const fromEmail = process.env.EMAIL_FROM;
    const toEmail = process.env.EMAIL_TO;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!fromEmail || !toEmail) {
      return NextResponse.json(
        {
          message: "Email sender or recipient is not configured in environment variables.",
        },
        { status: 500 }
      );
    }

    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not defined in environment variables");
      return NextResponse.json(
        { message: "Email service is not configured." },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `🚨 Fault Alert: ${fault.description} on ${machineName}`,
      html: createFaultEmailTemplate(machineName, fault),
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json(
        {
          message: "Failed to send fault notification email via Resend.",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Fault notification email sent successfully.", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send fault email:", error);
    return NextResponse.json(
      {
        message: "Failed to send fault notification email.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
