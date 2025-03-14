import { NextResponse } from 'next/server';
import { postSchema } from '@/helper/schema/schema';
import prisma from '@/lib/prisma';
import { responseStatus } from '@/helper/system-config';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = postSchema.parse({
            ...body,
            tags: JSON.parse(body.tags),
            categories: JSON.parse(body.categories),
            meta: JSON.parse(body.meta),
        });

        const existingPost = await prisma.post.findUnique({
            where: { slug: validatedData.slug }
        });

        if (existingPost) {
            return NextResponse.json({ status: responseStatus.warning, message: 'Slug already exists. Please use a different one.' }, { status: 400 });
        }

        const categoryLinks = await Promise.all(
            validatedData.categories.map(async (name: string) => {
                const category = await prisma.category.upsert({
                    where: { name },
                    update: {},
                    create: { name },
                });

                return { categoryId: category.id };
            })
        );

        const newPost = await prisma.post.create({
            data: {
                title: validatedData.title,
                content: validatedData.content,
                excerpt: validatedData.excerpt,
                slug: validatedData.slug,
                status: validatedData.status,
                categories: {
                    create: categoryLinks,
                },
                tags: validatedData.tags,
                // authorId: validatedData.authorId,
                author: {
                    connect: { id: validatedData.authorId },
                },
                featuredImage: validatedData.featuredImage,
                altText: validatedData.altText,
                commentStatus: validatedData.commentStatus,
                meta: validatedData.meta,
            },
            include: {
                categories: { include: { category: true } },
                author: true,
            },
        });

        return NextResponse.json({ data: newPost, status: responseStatus.success, message: 'Post created successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ status: responseStatus.error, message: error || 'Something went wrong' }, { status: 400 });
    }
}
