import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyToken } from "./helper/jwt-helper";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(process.env["COOKIE_NAME"]!)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const isVerified = await verifyToken(token);
  if (!isVerified) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
    matcher: [
        "/admin/:path*",
    ],
};