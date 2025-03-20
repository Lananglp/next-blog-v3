import { responseStatus } from "@/helper/system-config";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get("slug");

        if (!slug) return NextResponse.json({ status: responseStatus.warning, error: "Slug is required" }, { status: 400 });

        const post = await prisma.post.findUnique({
            where: { slug },
            include: {
                comments: {
                    where: { parentId: null }, // Hanya ambil komentar utama
                    include: {
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
                                },
                            }
                        },
                        author: {
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
                        replyToUser: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            }
                        }
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!post) return NextResponse.json({ status: responseStatus.warning, error: "Post not found" }, { status: 404 });

        return NextResponse.json(post.comments);
    } catch (error) {
        return NextResponse.json({ status: responseStatus.error, error: "Failed to fetch comments" }, { status: 500 });
    }
}