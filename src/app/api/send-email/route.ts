import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: `"PLC Software" <${process.env.SMTP_FROM_EMAIL}>`,
      replyTo: email,
      to: process.env.SMTP_TO_EMAIL, // Your business email
      subject: `New message from ${name} - PLC Software Contact Form`,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">New Contact Form Submission</h1>
          <p><strong style="color: #4b5563;">Name:</strong> ${name}</p>
          <p><strong style="color: #4b5563;">Email:</strong> ${email}</p>
          <p><strong style="color: #4b5563;">Message:</strong></p>
          <p style="background: #f3f4f6; padding: 16px; border-radius: 8px;">${message.replace(/\n/g, '<br>')}</p>
          <p style="margin-top: 24px; font-size: 12px; color: #6b7280;">
            Sent from PLC Software contact form
          </p>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true,
      messageId: info.messageId 
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}