import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Pastikan prisma client sudah dikonfigurasi
import { responseStatus } from "@/helper/system-config";

export async function DELETE(request: Request) {
    const { followerId, followedId } = await request.json();

    // Hapus relasi follow
    const deletedFollow = await prisma.follow.deleteMany({
        where: {
            followerId,
            followedId,
        },
    });

    if (deletedFollow.count === 0) {
        return NextResponse.json({ status: responseStatus.warning, message: "Not following" }, { status: 400 });
    }

    return NextResponse.json({ status: responseStatus.success, message: "Unfollowed successfully" });
}
