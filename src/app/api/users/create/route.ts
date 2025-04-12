import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { userSchema } from "@/helper/schema/schema";
import { imagekit } from "@/lib/imagekit";
import { responseStatus } from "@/helper/system-config";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const rawData = Object.fromEntries(formData.entries());
        const parsedData = userSchema.parse(rawData);

        const imageFile = formData.get("imageFile") as File | null;

        // Cek apakah email sudah terdaftar
        const existingUser = await prisma.user.findUnique({
            where: { email: parsedData.email },
        });

        if (parsedData.password !== parsedData.confirmPassword) {
            return NextResponse.json(
                { status: responseStatus.warning, message: "Password and confirm password do not match" },
                { status: 400 }
            );
        }

        if (existingUser) {
            return NextResponse.json(
                { status: responseStatus.warning, message: "Email already registered" },
                { status: 400 }
            );
        }

        // Validasi: username unik
        const existingUsername = await prisma.user.findUnique({
            where: { username: parsedData.username },
        });

        if (existingUsername) {
            return NextResponse.json(
                { status: responseStatus.warning, message: "Username already taken" },
                { status: 400 }
            );
        }

        // Proses upload image (jika ada)
        let imageUrl = parsedData.image || "";
        let imagekitFileId = null;
        let isImagekit = false;

        if (imageFile) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());

            const uploadedImage = await imagekit.upload({
                file: buffer,
                fileName: `profile-${parsedData.name}`,
                folder: "/users",
            });

            imageUrl = `${uploadedImage.url}?tr=f-webp`;
            imagekitFileId = uploadedImage.fileId;
            isImagekit = true;
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(parsedData.password, 10);

        // Buat user baru
        const user = await prisma.user.create({
            data: {
                name: parsedData.name,
                username: parsedData.username,
                email: parsedData.email,
                image: imageUrl,
                imageId: imagekitFileId,
                imageProvider: isImagekit ? "DEFAULT" : "OTHER",
                role: parsedData.role,
                password: hashedPassword,
                usernameChangedAt: new Date(), // set tanggal saat register
            },
        });

        return NextResponse.json(
            { status: responseStatus.success, message: "User created successfully", userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return NextResponse.json(
                    { status: responseStatus.warning, message: "Duplicate field (email/username)" },
                    { status: 400 }
                );
            }
        }

        console.error("Register error:", error);
        return NextResponse.json(
            { status: responseStatus.error, message: "Internal server error" },
            { status: 500 }
        );
    }
}
