import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Pastikan prisma client sudah dikonfigurasi
import { responseStatus } from "@/helper/system-config";

export async function POST(request: Request) {
    const { followerId, followedId } = await request.json();

    // Cek apakah sudah ada hubungan follow antara followerId dan followedId
    const existingFollow = await prisma.follow.findUnique({
        where: {
            followerId_followedId: {
                followerId,
                followedId,
            },
        },
    });

    if (existingFollow) {
        return NextResponse.json({ status: responseStatus.warning, message: "Already following" }, { status: 400 });
    }

    // Simpan relasi follow
    await prisma.follow.create({
        data: {
            followerId,
            followedId,
        },
    });

    return NextResponse.json({ status: responseStatus.success, message: "Followed successfully" });
}
