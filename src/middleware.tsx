import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyRoleToken, verifyToken } from "./helper/jwt-helper";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(process.env["COOKIE_NAME"]!)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/not-found", req.url));
  }

  const isVerified = await verifyToken(token);

  if (!isVerified) {
    return NextResponse.redirect(new URL("/not-found", req.url));
  }

  const checkRole = await verifyRoleToken(token);

  if (!checkRole) {
    return NextResponse.redirect(new URL("/not-found", req.url));
  }

  return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/api/images/:path*",
        // "/api/logout/:path*",
        "/api/posts/route.ts",
        "/api/posts/create/:path*",
        "/api/posts/edit/:path*",
        "/api/posts/delete/:path*",
        "/api/upload/:path*",
    ],
};