import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import * as zod from "zod";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import { loginSchema } from "@/helper/schema/loginSchema";

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

        const token = sign(
          {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          process.env.NEXT_PUBLIC_JWT_SECRET as string,
          { expiresIn: "7d" }
        );

        (await cookies()).set("token", token, {
          //   httpOnly: true,
          //   secure: process.env.NODE_ENV === "production",
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