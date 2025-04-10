import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/helper/schema/registerSchema";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data = registerSchema.parse(body);

        // Cek apakah email sudah terdaftar
        const existingEmail = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingEmail) {
            return NextResponse.json({ message: "Email already registered" }, { status: 400 });
        }

        // Cek apakah username sudah digunakan
        const existingUsername = await prisma.user.findUnique({
            where: { username: data.username },
        });

        if (existingUsername) {
            return NextResponse.json({ message: "Username already taken" }, { status: 400 });
        }

        // Cek apakah password sama dengan confirm password
        if (data.password !== data.confirmPassword) {
            return NextResponse.json({ message: "Password and confirm password do not match" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(data.password, 10);

        // Buat user baru
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                username: data.username,
                password: hashedPassword,
                usernameChangedAt: new Date(),
            },
        });

        return NextResponse.json({
            message: "User created successfully",
            userId: user.id,
            username: user.username,
        }, { status: 201 });

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return NextResponse.json({ message: "Unique constraint failed (username/email already in use)" }, { status: 400 });
            }
        }
        console.error("Register error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
