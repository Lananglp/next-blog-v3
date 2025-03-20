import { responseStatus } from "@/helper/system-config";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { content, authorId, slug, parentId } = await req.json();

        if (!slug || !content || !authorId) {
            return NextResponse.json({ 
                status: responseStatus.warning, 
                message: "Missing required fields" 
            }, { status: 400 });
        }

        // Cari post berdasarkan slug
        const post = await prisma.post.findUnique({ where: { slug } });
        if (!post) {
            return NextResponse.json({ 
                status: responseStatus.warning, 
                message: "Post not found" 
            }, { status: 404 });
        }

        let replyToUserId = null;

        // Jika parentId ada, cek apakah parent komentar valid
        if (parentId) {
            const parentComment = await prisma.comment.findUnique({
                where: { id: parentId },
                select: { authorId: true, postId: true }
            });

            if (!parentComment || parentComment.postId !== post.id) {
                return NextResponse.json({ 
                    status: responseStatus.warning, 
                    message: "Invalid parent comment" 
                }, { status: 400 });
            }

            replyToUserId = parentComment.authorId;
        }

        // Buat komentar baru
        const comment = await prisma.comment.create({
            data: {
                content,
                authorId,
                postId: post.id,
                parentId: parentId || null,
                replyToUserId, // Simpan user yang direply jika ini balasan
            },
        });

        return NextResponse.json({ 
            status: responseStatus.success, 
            message: "You added a comment", 
            comment 
        }, { status: 201 });

    } catch (error) {
        console.error("Error adding comment:", error);
        return NextResponse.json({ 
            status: responseStatus.error, 
            message: "Failed to add comment" 
        }, { status: 500 });
    }
}
