import { sendMail } from "@/lib/mailer";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token manquant" }, { status: 400 });
  }

  try {
    // Trouver la demande de changement d'email
    const emailChangeRequest = await prisma.emailChangeRequest.findUnique({
      where: { token },
    });

    if (!emailChangeRequest) {
      return NextResponse.json({ error: "Token invalide" }, { status: 400 });
    }

    // Vérifier si le token a expiré
    if (emailChangeRequest.expiresAt < new Date()) {
      // Supprimer la demande expirée
      await prisma.emailChangeRequest.delete({
        where: { id: emailChangeRequest.id },
      });
      return NextResponse.json({ error: "Token expiré" }, { status: 400 });
    }

    // Mettre à jour l'email de l'utilisateur
    await prisma.user.update({
      where: { id: emailChangeRequest.userId },
      data: { email: emailChangeRequest.newEmail },
    });

    // Supprimer la demande de changement
    await prisma.emailChangeRequest.delete({
      where: { id: emailChangeRequest.id },
    });

    // Envoyer un email de confirmation
    await sendMail({
      to: emailChangeRequest.newEmail,
      subject: "Email changé avec succès",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email changé avec succès</h2>
          <p>Bonjour,</p>
          <p>Votre adresse email a été changée avec succès.</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Nouvelle adresse email:</strong> ${emailChangeRequest.newEmail}</p>
            <p><strong>Ancienne adresse email:</strong> ${emailChangeRequest.oldEmail}</p>
          </div>
          <p>Vous pouvez maintenant utiliser votre nouvelle adresse email pour vous connecter.</p>
          <p>Cordialement,<br>L'équipe de support</p>
        </div>
      `,
    });

    // Rediriger vers une page de succès
    return NextResponse.redirect(
      `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/auth?email-changed=true`,
    );
  } catch (error) {
    console.error("Error confirming email change:", error);
    return NextResponse.json(
      { error: "Erreur lors de la confirmation du changement d'email" },
      { status: 500 },
    );
  }
}
