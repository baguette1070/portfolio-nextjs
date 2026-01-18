import Navbar from "@/components/navbar";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio | Développeur Full Stack",
  description:
    "Portfolio professionnel - Développeur Full Stack passionné par les technologies web modernes",
  keywords: [
    "développeur",
    "full stack",
    "react",
    "next.js",
    "typescript",
    "portfolio",
  ],
  authors: [{ name: "Votre Nom" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />

        {children}
        <Toaster />
      </body>
    </html>
  );
}
