import { getUser } from "@/lib/auth-session";
import { sendMail } from "@/lib/mailer";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  console.log("Request body:", body);

  if (!body || !body.email) {
    console.log("Missing email in body:", body);
    return NextResponse.json(
      { error: "Bad Request - Email is required" },
      { status: 400 },
    );
  }

  const newEmail = body.email;
  const oldEmail = user.email;
  console.log("Email change request:", { oldEmail, newEmail, userId: user.id });

  // Vérifier si le nouvel email est déjà utilisé
  const existingUser = await prisma.user.findUnique({
    where: { email: newEmail },
  });

  if (existingUser && existingUser.id !== user.id) {
    console.log("Email already exists:", existingUser.email);
    return NextResponse.json(
      { error: "Cet email est déjà utilisé par un autre compte" },
      { status: 400 },
    );
  }

  // Si l'email existe mais appartient au même utilisateur, on autorise le changement
  if (existingUser && existingUser.id === user.id) {
    console.log("User is reverting to their own email:", newEmail);
    return NextResponse.json({
      success: true,
      message: "Email mis à jour avec succès.",
      user: existingUser,
    });
  }

  // Générer un token de confirmation
  const confirmationToken = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

  try {
    // Sauvegarder la demande de changement d'email
    await prisma.emailChangeRequest.create({
      data: {
        userId: user.id,
        oldEmail,
        newEmail,
        token: confirmationToken,
        expiresAt,
      },
    });

    // Envoyer l'email de confirmation au nouvel email
    const confirmationLink = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/confirm-email-change?token=${confirmationToken}`;

    await sendMail({
      to: newEmail,
      subject: "Confirmez votre changement d'email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Confirmez votre changement d'email</h2>
          <p>Bonjour ${user.name || "Utilisateur"},</p>
          <p>Une demande de changement d'email a été effectuée pour votre compte.</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email actuel:</strong> ${oldEmail}</p>
            <p><strong>Nouvel email:</strong> ${newEmail}</p>
          </div>
          <p>Pour confirmer ce changement, veuillez cliquer sur le bouton ci-dessous:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationLink}" 
               style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Confirmer le changement d'email
            </a>
          </div>
          <p style="font-size: 12px; color: #666;">
            Ce lien expirera dans 24 heures. Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet email.
          </p>
          <p>Cordialement,<br>L'équipe de support</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message:
        "Un email de confirmation a été envoyé à votre nouvelle adresse email. Veuillez cliquer sur le lien pour confirmer le changement.",
    });
  } catch (error) {
    console.error("Error updating email:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email de confirmation" },
      { status: 500 },
    );
  }
}
