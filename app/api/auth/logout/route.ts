// /api/auth/logout

import { signOut } from "@/auth";
import { AuthError } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

const API_TOKEN_COOKIE_NAME = "api_access_token";

export async function POST(request: NextRequest) {
  try {
    await signOut({ redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
        default:
          return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
      }
    }
    throw error;
  }
  const response = NextResponse.json({ success: "Successful log out." }, { status: 200 });
  response.cookies.set(API_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
