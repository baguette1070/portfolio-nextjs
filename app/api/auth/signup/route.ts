import { sendMail } from "@/lib/mailer";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, image } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 },
      );
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("Email already exists during signup:", email);
      return NextResponse.json(
        {
          error:
            "Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.",
        },
        { status: 400 },
      );
    }

    // Vérifier si une confirmation est déjà en attente
    const existingConfirmation = await prisma.accountConfirmation.findUnique({
      where: { email },
    });

    if (existingConfirmation) {
      // Supprimer l'ancienne demande
      await prisma.accountConfirmation.delete({
        where: { id: existingConfirmation.id },
      });
    }

    // Générer un token de confirmation
    const confirmationToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

    // Sauvegarder la demande de confirmation
    await prisma.accountConfirmation.create({
      data: {
        email,
        name,
        password,
        image: image || null,
        token: confirmationToken,
        expiresAt,
      },
    });

    // Envoyer l'email de confirmation
    const confirmationLink = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/confirm-signup?token=${confirmationToken}`;

    await sendMail({
      to: email,
      subject: "Confirmez votre inscription",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Confirmez votre inscription</h2>
          <p>Bonjour ${name || "Utilisateur"},</p>
          <p>Merci de vous être inscrit sur notre plateforme !</p>
          <p>Pour finaliser votre inscription, veuillez cliquer sur le bouton ci-dessous:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationLink}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      display: inline-block;
                      font-weight: bold;">
              Confirmer mon inscription
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Ce lien expirera dans 24 heures.<br>
            Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet email.
          </p>
          <p>Cordialement,<br>L'équipe de support</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message:
        "Un email de confirmation a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception.",
    });
  } catch (error) {
    console.error("Error creating account :", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
