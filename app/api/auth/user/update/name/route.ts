import { getUser } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: body.name,
    },
  });

  return NextResponse.json(updated);
}
