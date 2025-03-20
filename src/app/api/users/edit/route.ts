import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { userEditSchema } from "@/helper/schema/schema";
import { imagekit } from "@/lib/imagekit";
import { responseStatus } from "@/helper/system-config";

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const rawData = Object.fromEntries(formData.entries());
        const parsedData = userEditSchema.parse(rawData);

        if (!parsedData || !parsedData.id) {
            return NextResponse.json({ status: responseStatus.warning, message: "Invalid user data" }, { status: 400 });
        }

        const userId = parsedData.id; // Pastikan ID user dikirim
        const imageFile = formData.get("imageFile") as File | null;

        const existingUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!existingUser) {
            return NextResponse.json({ status: responseStatus.warning, message: "User not found" }, { status: 404 });
        }

        let imageUrl = existingUser.image;
        let imagekitFileId = null;
        let isImagekit = false;

        if (imageFile) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());

            if (!buffer.length) {
                return NextResponse.json({ status: responseStatus.warning, message: "Invalid image file" }, { status: 400 });
            }

            if (existingUser.image && existingUser.imageProvider === "DEFAULT") {
                if (existingUser.imageId) {
                    try {
                        await imagekit.deleteFile(existingUser.imageId);
                    } catch (err) {
                        console.error("Error deleting old image:", err);
                    }
                } else {
                    console.error("No imageId found for the user");
                }
            }

            const uploadedImage = await imagekit.upload({
                file: buffer,
                fileName: `profile-${parsedData.name}`,
                folder: "/users",
            });

            imageUrl = uploadedImage.url;
            imagekitFileId = uploadedImage.fileId;
            isImagekit = true;
        }

        const updateData: any = {
            name: parsedData.name,
            email: parsedData.email,
            image: imageUrl,
            imageId: imagekitFileId,
            imageProvider: isImagekit ? "DEFAULT" : "OTHER",
            role: parsedData.role,
        };

        if (parsedData.password) {
            updateData.password = bcrypt.hashSync(parsedData.password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        return NextResponse.json({ item: updateData, status: responseStatus.success, message: "User updated successfully", userId: updatedUser.id }, { status: 200 });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return NextResponse.json({ status: responseStatus.warning, message: "Email already in use" }, { status: 400 });
            }
        }
        console.error("Update error:", error);
        return NextResponse.json({ status: responseStatus.error, message: "Internal server error" }, { status: 500 });
    }
}
