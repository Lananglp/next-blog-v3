import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const followerId = searchParams.get("followerId");
    const followedId = searchParams.get("followedId");

    if (!followerId || !followedId) {
        return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const follow = await prisma.follow.findUnique({
        where: {
            followerId_followedId: {
                followerId,
                followedId,
            },
        },
    });

    return NextResponse.json({ isFollowing: follow !== null });
}
