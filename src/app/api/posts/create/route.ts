import { NextResponse } from 'next/server';
import { postSchema } from '@/helper/schema/schema';
import prisma from '@/lib/prisma';
import { responseStatus } from '@/helper/system-config';
import { nanoid } from 'nanoid';
import slugify from 'slugify';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = postSchema.parse({
            ...body,
            tags: JSON.parse(body.tags),
            categories: JSON.parse(body.categories),
            meta: JSON.parse(body.meta),
        });

        // Buat slug dari title
        const baseSlug = slugify(validatedData.title, { lower: true, strict: true });
        const uniqueId = nanoid(12);
        const finalSlug = `${baseSlug}-${uniqueId}`;

        // Upsert semua kategori dulu dalam 1 transaction
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

        // Buat post + meta dalam 1 step
        const newPost = await prisma.post.create({
            data: {
                title: validatedData.title,
                content: validatedData.content,
                description: validatedData.description,
                slug: finalSlug,
                status: validatedData.status,
                categories: {
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
                data: newPost,
                status: responseStatus.success,
                message: 'Post created successfully',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('POST /api/post error:', error);
        return NextResponse.json(
            {
                status: responseStatus.error,
                message: error instanceof Error ? error.message : 'Something went wrong',
            },
            { status: 400 }
        );
    }
}
