import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        callbackURL: "/auth/signin",
      },
    });

    if (!result) {
      return NextResponse.json(
        { error: "Erreur lors de la création du compte" },
        { status: 500 },
      );
    }

    if (image && result.user) {
      await prisma.user.update({
        where: { id: result.user.id },
        data: {
          ...(image && { image }),
        },
      });
    }
    return NextResponse.json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
    });
  } catch (error) {
    console.error("Error creating account :", error);

    if (error instanceof Error) {
      if (
        error.message.includes("already exists") ||
        error.message.includes("unique")
      ) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
