import { sendMail } from "@/lib/mailer";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const { subject, message, email } = await request.json();

  if (!subject || !message || !email) {
    return NextResponse.json(
      { error: "Subject, message and email are required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Créer ou mettre à jour le message de l'utilisateur
  const updateMessage = await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      message,
      subject,
    },
  });

  const userEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Message Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Message Received!</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Hello <strong>${user.name}</strong>,
                      </p>
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Thank you for reaching out! I have successfully received your message and will get back to you as soon as possible.
                      </p>
                      
                      <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px;">
                        <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;">Your Message:</p>
                        <p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
                        <p style="color: #333333; font-size: 14px; margin: 0; line-height: 1.6;">${message}</p>
                      </div>
                      
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                      <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                        Best regards,<br>
                        <strong>Lamrini Nawfal</strong><br>
                        Full Stack Developer
                      </p>
                      <p style="color: #999999; font-size: 12px; margin: 20px 0 0 0;">
                        This is an automated confirmation email. Please do not reply to this message.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

  await sendMail({
    to: email,
    subject: subject + " - noreply",
    html: userEmailHtml,
  });

  return NextResponse.json({ updateMessage });
}

export async function GET() {
  try {
    const requests = await prisma.user.findMany({
      where: {
        message: {
          not: null,
        },
      },
      select: {
        name: true,
        email: true,
        subject: true,
        message: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const deleteMessage = await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      message: null,
      subject: null,
    },
  });

  return NextResponse.json({ deleteMessage });
}
