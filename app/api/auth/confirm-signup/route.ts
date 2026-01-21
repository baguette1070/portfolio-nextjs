import { auth } from "@/lib/auth";
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
    // Trouver la demande de confirmation
    const accountConfirmation = await prisma.accountConfirmation.findUnique({
      where: { token },
    });

    if (!accountConfirmation) {
      return NextResponse.json({ error: "Token invalide" }, { status: 400 });
    }

    // Vérifier si le token a expiré
    if (accountConfirmation.expiresAt < new Date()) {
      // Supprimer la demande expirée
      await prisma.accountConfirmation.delete({
        where: { id: accountConfirmation.id },
      });
      return NextResponse.json({ error: "Token expiré" }, { status: 400 });
    }

    // Créer le compte utilisateur
    const result = await auth.api.signUpEmail({
      body: {
        email: accountConfirmation.email,
        password: accountConfirmation.password,
        name: accountConfirmation.name,
        callbackURL: "/auth/signin",
      },
    });

    if (!result || !result.user) {
      return NextResponse.json(
        { error: "Erreur lors de la création du compte" },
        { status: 500 },
      );
    }

    // Mettre à jour l'image si elle existe
    if (accountConfirmation.image) {
      await prisma.user.update({
        where: { id: result.user.id },
        data: { image: accountConfirmation.image },
      });
    }

    // Supprimer la demande de confirmation
    await prisma.accountConfirmation.delete({
      where: { id: accountConfirmation.id },
    });

    // Envoyer un email de confirmation
    await sendMail({
      to: accountConfirmation.email,
      subject: "Inscription confirmée avec succès",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Bienvenue !</h2>
          <p>Bonjour ${accountConfirmation.name || "Utilisateur"},</p>
          <p>Votre inscription a été confirmée avec succès !</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> ${accountConfirmation.email}</p>
            <p><strong>Nom:</strong> ${accountConfirmation.name}</p>
          </div>
          <p>Vous pouvez maintenant vous connecter à votre compte.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/auth/signin" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      display: inline-block;
                      font-weight: bold;">
              Me connecter
            </a>
          </div>
          <p>Cordialement,<br>L'équipe de support</p>
        </div>
      `,
    });

    // Rediriger vers une page de succès
    return NextResponse.redirect(
      `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/auth/signin?signup-success=true`,
    );
  } catch (error) {
    console.error("Error confirming signup:", error);
    return NextResponse.json(
      { error: "Erreur lors de la confirmation de l'inscription" },
      { status: 500 },
    );
  }
}
