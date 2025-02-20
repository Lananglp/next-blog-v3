import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import * as zod from "zod";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { loginSchema } from "@/helper/schema/loginSchema";

const SECRET_KEY = new TextEncoder().encode(process.env.SECRET_KEY as string);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data = loginSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const validatePassword = await bcrypt.compare(data.password, user.password);

        if (!validatePassword) {
            return NextResponse.json({ message: "Invalid password" }, { status: 401 });
        }

        const token = await new SignJWT({ id: user.id }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(SECRET_KEY);
        // const token = await new SignJWT({
        //     id: user.id,
        //     email: user.email,
        //     name: user.name,
        //     image: user.image,
        //     role: user.role,
        //     createdAt: user.createdAt,
        //     updatedAt: user.updatedAt,
        // })
        //     .setProtectedHeader({ alg: "HS256" })
        //     .setExpirationTime("7d")
        //     .sign(SECRET_KEY);

        (await cookies()).set(process.env["COOKIE_NAME"]!, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 hari
        });

        const UserNoPassword = {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        return NextResponse.json({ message: `Logged in as ${user.name}`, user: UserNoPassword }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}