import prisma from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { sendMail } from "./mailer";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data) {
      await sendMail({
        to: `${data.user.email}`,
        subject: "Réinitialisation du mot de passe",
        html: `<p><strong>Réinitialiser votre mot de passe en cliquant sur le lien ci-dessous</strong> :<br /> <a href="${data.url}">${data.url}</a></p>`,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [nextCookies()],
});
