import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return new Response(`<h1>Email is required</h1>`, {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: String(email) },
    });

    if (!user) {
      return new Response(`<h1>User not found</h1>`, {
        status: 404,
        headers: { "Content-Type": "text/html" },
      });
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    // Set session cookie using response headers
    const response = new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Email Verified</title>
          <meta http-equiv="refresh" content="3;url=/" />
        </head>
        <body>
          <h1>Email Verified Successfully!</h1>
          <p>You will be redirected to the home page shortly...</p>
        </body>
      </html>`,
      { 
        status: 200, 
        headers: { 
          "Content-Type": "text/html",
          "Set-Cookie": `user_email=${user.email}; Path=/; HttpOnly; Max-Age=604800; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
        } 
      }
    );
    
    return response;
  } catch (error) {
    console.error("Verification error:", error);
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Error</title>
        </head>
        <body>
          <h1>Verification Failed</h1>
          <p>An error occurred while verifying your email. Please try again later.</p>
        </body>
      </html>`,
      { 
        status: 500, 
        headers: { 
          "Content-Type": "text/html" 
        } 
      }
    );
  }
}
