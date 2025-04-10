import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { userEditSchema } from "@/helper/schema/schema";
import { imagekit } from "@/lib/imagekit";
import { responseStatus } from "@/helper/system-config";
import { getCooldownRemainingNumber } from "@/helper/helper";

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const rawData = Object.fromEntries(formData.entries());
        const parsedData = userEditSchema.parse(rawData);

        if (!parsedData || !parsedData.id) {
            return NextResponse.json({ status: responseStatus.warning, message: "Invalid user data" }, { status: 400 });
        }

        const userId = parsedData.id;
        const imageFile = formData.get("imageFile") as File | null;

        const existingUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!existingUser) {
            return NextResponse.json({ status: responseStatus.warning, message: "User not found" }, { status: 404 });
        }

        // 🔒 Pengecekan jika username diubah
        if (parsedData.username && parsedData.username !== existingUser.username) {
            const cooldown = getCooldownRemainingNumber(existingUser.usernameChangedAt);

            if (cooldown > 0) {
                return NextResponse.json({
                    status: responseStatus.warning,
                    message: `You can change your username in ${cooldown} day(s)`,
                }, { status: 400 });
            }

            // Cek apakah username sudah dipakai user lain
            const usernameTaken = await prisma.user.findFirst({
                where: {
                    username: parsedData.username,
                    NOT: { id: userId },
                },
            });

            if (usernameTaken) {
                return NextResponse.json({ status: responseStatus.warning, message: "Username already taken" }, { status: 400 });
            }
        }

        let imageUrl = existingUser.image;
        let imagekitFileId = null;
        let isImagekit = false;

        if (imageFile) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            if (!buffer.length) {
                return NextResponse.json({ status: responseStatus.warning, message: "Invalid image file" }, { status: 400 });
            }

            if (existingUser.image && existingUser.imageProvider === "DEFAULT" && existingUser.imageId) {
                try {
                    await imagekit.deleteFile(existingUser.imageId);
                } catch (err) {
                    console.error("Error deleting old image:", err);
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
            username: parsedData.username || existingUser.username,
            image: imageUrl,
            imageId: imagekitFileId,
            imageProvider: isImagekit ? "DEFAULT" : existingUser.imageProvider,
            role: parsedData.role,
        };

        if (parsedData.password) {
            updateData.password = bcrypt.hashSync(parsedData.password, 10);
        }

        // Set usernameChangedAt jika username diubah
        if (parsedData.username && parsedData.username !== existingUser.username) {
            updateData.usernameChangedAt = new Date();
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        return NextResponse.json({ item: updateData, status: responseStatus.success, message: "User updated successfully", userId: updatedUser.id }, { status: 200 });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return NextResponse.json({ status: responseStatus.warning, message: "Email or Username already in use" }, { status: 400 });
            }
        }
        console.error("Update error:", error);
        return NextResponse.json({ status: responseStatus.error, message: "Internal server error" }, { status: 500 });
    }
}
