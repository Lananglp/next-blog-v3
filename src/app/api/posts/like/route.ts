import { responseStatus } from "@/helper/system-config";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { postId, userId } = await req.json();

        if (!postId || !userId) {
            return NextResponse.json(
                { status: responseStatus.warning, message: "Post ID and User ID are required" },
                { status: 400 }
            );
        }

        // Cek apakah user sudah like post ini
        const existingLike = await prisma.postLike.findUnique({
            where: { userId_postId: { userId, postId } },
        });

        if (existingLike) {
            // Jika sudah like, maka unlike (hapus like)
            await prisma.postLike.delete({
                where: { id: existingLike.id },
            });
            return NextResponse.json({ success: responseStatus.success, message: "Unlike success" });
        } else {
            // Jika belum like, tambahkan like
            await prisma.postLike.create({
                data: { postId, userId },
            });
            return NextResponse.json({ success: responseStatus.success, message: "Like success" });
        }
    } catch (error) {
        return NextResponse.json(
            { status: responseStatus.warning, message: "Failed to like post" },
            { status: 500 }
        );
    }
}
