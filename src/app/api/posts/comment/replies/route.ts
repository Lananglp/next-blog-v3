import { responseStatus } from "@/helper/system-config";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const commentId = searchParams.get("commentId");

        if (!commentId) {
            return NextResponse.json({
                status: responseStatus.warning,
                message: "Comment ID is required"
            }, { status: 400 });
        }

        // Cek apakah komentar utama ada
        const parentComment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: { id: true }
        });

        if (!parentComment) {
            return NextResponse.json({
                status: responseStatus.warning,
                message: "Comment not found"
            }, { status: 404 });
        }

        // Ambil replies berdasarkan parentId
        const replies = await prisma.comment.findMany({
            where: { parentId: commentId },
            orderBy: { createdAt: "asc" },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                },
                replyToUser: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                },
                likes: {
                    select: {
                        commentId: true,
                        userId: true,
                    }
                },
                replies: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            }
                        },
                        replyToUser: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            }
                        },
                        likes: {
                            select: {
                                commentId: true,
                                userId: true,
                            }
                        }
                    },
                    orderBy: { createdAt: "asc" } // Urutan replies dari yang lama ke baru
                }
            }
        });

        return NextResponse.json(replies, { status: 200 });
        // return NextResponse.json({
        //     status: responseStatus.success,
        //     message: "Replies fetched successfully",
        //     data: replies
        // }, { status: 200 });

    } catch (error) {
        console.error("Error fetching replies:", error);
        return NextResponse.json({
            status: responseStatus.error,
            message: "Failed to fetch replies"
        }, { status: 500 });
    }
}
