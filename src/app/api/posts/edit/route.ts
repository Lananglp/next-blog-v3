import { NextResponse } from 'next/server';
import { postSchema } from '@/helper/schema/schema';
import prisma from '@/lib/prisma';
import { responseStatus } from '@/helper/system-config';
import { nanoid } from 'nanoid';
import slugify from 'slugify';

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const validatedData = postSchema.parse({
            ...body,
            tags: JSON.parse(body.tags),
            categories: JSON.parse(body.categories),
            meta: JSON.parse(body.meta),
        });

        const existingPost = await prisma.post.findUnique({
            where: { id: validatedData.id },
        });

        if (!existingPost) {
            return NextResponse.json(
                { status: responseStatus.warning, message: 'Post not found.' },
                { status: 404 }
            );
        }

        // Buat slug baru jika title berubah
        let finalSlug = existingPost.slug;
        if (validatedData.title !== existingPost.title) {
            const baseSlug = slugify(validatedData.title, { lower: true, strict: true });
            const uniqueId = nanoid(12);
            finalSlug = `${baseSlug}-${uniqueId}`;
        }

        // Upsert kategori dalam satu transaksi
        const categoryOps = validatedData.categories.map((name: string) =>
            prisma.category.upsert({
                where: { name },
                update: {},
                create: { name },
            })
        );

        const categories = await prisma.$transaction(categoryOps);

        const categoryLinks = categories.map((cat) => ({
            categoryId: cat.id,
        }));

        // Jalankan update post dalam transaksi agar efisien
        const updatedPost = await prisma.post.update({
            where: { id: validatedData.id },
            data: {
                title: validatedData.title,
                content: validatedData.content,
                description: validatedData.description,
                slug: finalSlug,
                status: validatedData.status,
                categories: {
                    deleteMany: {}, // Hapus relasi lama
                    create: categoryLinks,
                },
                tags: validatedData.tags,
                author: {
                    connect: { id: validatedData.authorId },
                },
                image: validatedData.image,
                altText: validatedData.altText,
                commentStatus: validatedData.commentStatus,
                meta: {
                    create: validatedData.meta,
                },
            },
            include: {
                categories: {
                    include: {
                        category: {
                            select: { name: true },
                        },
                    },
                },
                author: {
                    select: { name: true },
                },
                meta: {
                    select: {
                        title: true,
                        description: true,
                        keywords: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json(
            {
                data: updatedPost,
                status: responseStatus.success,
                message: 'Post updated successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('PATCH /api/post error:', error);
        return NextResponse.json(
            {
                status: responseStatus.error,
                message: error instanceof Error ? error.message : 'Something went wrong',
            },
            { status: 400 }
        );
    }
}
