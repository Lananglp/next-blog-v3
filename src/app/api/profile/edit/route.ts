import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { userProfileSchema } from "@/helper/schema/schema";
import { imagekit } from "@/lib/imagekit";
import { responseStatus } from "@/helper/system-config";
import { getCooldownRemainingNumber } from "@/helper/helper";

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const rawData = Object.fromEntries(formData.entries());
        const parsedData = userProfileSchema.parse(rawData);

        if (!parsedData?.id) {
            return NextResponse.json({ status: responseStatus.warning, message: "Invalid user data" }, { status: 400 });
        }

        const userId = parsedData.id;
        const imageFile = formData.get("imageFile") as File | null;

        const existingUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!existingUser) {
            return NextResponse.json({ status: responseStatus.warning, message: "User not found" }, { status: 404 });
        }

        // Username logic
        if (parsedData.username && parsedData.username !== existingUser.username) {
            const cooldown = getCooldownRemainingNumber(existingUser.usernameChangedAt);

            if (cooldown > 0) {
                return NextResponse.json({
                    status: responseStatus.warning,
                    message: `You can change your username in ${cooldown} day(s)`,
                }, { status: 400 });
            }

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

        // Handle image upload
        let imageUrl = existingUser.image;
        let imagekitFileId = existingUser.imageId || null;
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

            imageUrl = `${uploadedImage.url}?tr=f-webp`;
            imagekitFileId = uploadedImage.fileId;
            isImagekit = true;
        }

        // Handle password & confirmPassword
        if (parsedData.password && parsedData.confirmPassword !== parsedData.password) {
            return NextResponse.json({ status: responseStatus.warning, message: "Passwords do not match" }, { status: 400 });
        }

        const updateData: Prisma.UserUpdateInput = {
            name: parsedData.name,
            email: parsedData.email,
            username: parsedData.username || existingUser.username,
            image: imageUrl,
            imageId: imagekitFileId,
            imageProvider: isImagekit ? "DEFAULT" : existingUser.imageProvider,
            role: parsedData.role,
            profile: {
                update: {
                    bio: parsedData.bio,
                    phone_1: parsedData.phone_1,
                    phone_2: parsedData.phone_2,
                    url_1: parsedData.url_1,
                    url_2: parsedData.url_2,
                },
            },
        };

        if (parsedData.password) {
            updateData.password = bcrypt.hashSync(parsedData.password, 10);
        }

        if (parsedData.username && parsedData.username !== existingUser.username) {
            updateData.usernameChangedAt = new Date();
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        return NextResponse.json({
            item: updatedUser,
            status: responseStatus.success,
            message: "User updated successfully",
            userId: updatedUser.id,
        }, { status: 200 });

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