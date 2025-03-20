import { responseStatus } from "@/helper/system-config";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { commentId, userId } = await req.json();

        if (!commentId || !userId) {
            return NextResponse.json({ status: responseStatus.warning, message: "Comment ID and User ID are required" }, { status: 400 });
        }

        // Cek apakah user sudah like komentar ini
        const existingLike = await prisma.commentLike.findUnique({
            where: { commentId_userId: { commentId, userId } },
        });

        if (existingLike) {
            // Jika sudah like, maka unlike (hapus like)
            await prisma.commentLike.delete({
                where: { id: existingLike.id },
            });
            return NextResponse.json({ success: responseStatus.success, message: "Unlike success" });
        } else {
            // Jika belum like, tambahkan like
            await prisma.commentLike.create({
                data: { commentId, userId },
            });
            return NextResponse.json({ success: responseStatus.success, message: "Like success" });
        }
    } catch (error) {
        return NextResponse.json({ status: responseStatus.warning, message: "Failed to like comment" }, { status: 500 });
    }
}
