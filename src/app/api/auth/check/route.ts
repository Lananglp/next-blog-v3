import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { responseStatus } from "@/helper/system-config";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        // Ambil token dari cookies
        const token = req.cookies.get(process.env.COOKIE_NAME!)?.value;

        if (!token) {
            return NextResponse.json({ status: responseStatus.unauthorized, message: "Unauthorized" }, { status: 401 });
        }

        // Verifikasi dan dekode token
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.id;

        const user = await prisma.user.findUnique({
            where: { id: userId as string },
        });
        
        if (!user) {
            return NextResponse.json({ status: responseStatus.unauthorized, message: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ user: user });
    } catch (error) {
        return NextResponse.json({ status: responseStatus.error, message: "Invalid token" }, { status: 401 });
    }
}
