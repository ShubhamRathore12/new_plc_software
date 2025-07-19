export const createFaultEmailTemplate = (
  machineName: string,
  fault: { tag: string; description: string }
) => {
  const now = new Date();
  const readableDate = now.toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Fault Alert</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          background-color: #f4f4f5;
          color: #18181b;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border: 1px solid #e4e4e7;
          border-radius: 8px;
          overflow: hidden;
        }
        .header {
          background-color: #dc2626;
          color: #ffffff;
          padding: 24px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 32px;
        }
        .content h2 {
          font-size: 20px;
          color: #18181b;
          margin-top: 0;
        }
        .content p {
          font-size: 16px;
          line-height: 1.5;
          margin: 8px 0;
        }
        .fault-details {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
        }
        .fault-details strong {
          color: #991b1b;
        }
        .footer {
          background-color: #f4f4f5;
          padding: 24px;
          text-align: center;
          font-size: 12px;
          color: #71717a;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 Fault Alert</h1>
        </div>
        <div class="content">
          <h2>A new fault has been detected.</h2>
          <p>The following fault was registered and requires your attention:</p>
          <div class="fault-details">
            <p><strong>Machine:</strong> ${machineName}</p>
            <p><strong>Fault Tag:</strong> ${fault.tag}</p>
            <p><strong>Description:</strong> ${fault.description}</p>
            <p><strong>Timestamp:</strong> ${readableDate}</p>
          </div>
          <p>Please review the system dashboard for more details.</p>
        </div>
        <div class="footer">
          <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const createContactEmailTemplate = (
  name: string,
  email: string,
  message: string,
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Form Submission</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
          background-color: #f4f4f5;
          color: #18181b;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border: 1px solid #e4e4e7;
          border-radius: 8px;
          overflow: hidden;
        }
        .header {
          background-color: #2563eb;
          color: #ffffff;
          padding: 24px;
          text-align: center;
        }
        .content {
          padding: 32px;
        }
        .content h2 {
          font-size: 20px;
          color: #18181b;
          margin-top: 0;
        }
        .content p {
          font-size: 16px;
          line-height: 1.5;
          margin: 8px 0;
        }
        .message {
          background-color: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 20px;
          white-space: pre-wrap;
        }
        .footer {
          background-color: #f4f4f5;
          padding: 24px;
          text-align: center;
          font-size: 12px;
          color: #71717a;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission</h1>
        </div>
        <div class="content">
          <h2>Details</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div class="message">${message.replace(/\n/g, '<br>')}</div>
        </div>
        <div class="footer">
          <p>Sent from PLC Software contact form.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
