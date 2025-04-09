import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { responseStatus } from '@/helper/system-config';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const pageParam = searchParams.get('page');
        const limitParam = searchParams.get('limit');
        const search = searchParams.get('search') || '';
        const categoryId = searchParams.get('categoryId');

        const page = pageParam ? parseInt(pageParam, 10) : undefined;
        const limit = limitParam ? parseInt(limitParam, 10) : undefined;

        const whereClause: Prisma.PostWhereInput = {
            AND: [
                search ? {
                    OR: [
                        { title: { contains: search, } },
                        { content: { contains: search, } },
                        { description: { contains: search, } },
                    ]
                } : {},
                categoryId ? {
                    categories: {
                        some: {
                            categoryId: categoryId,
                        },
                    },
                } : {},
            ].filter(Boolean),
        };

        const totalPosts = await prisma.post.count({ where: whereClause });

        const posts = await prisma.post.findMany({
            where: whereClause,
            skip: page && limit ? (page - 1) * limit : undefined,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                categories: {
                    include: {
                        category: true,
                    },
                },
                comments: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        const formattedPosts = posts.map(post => ({
            ...post,
            categories: post.categories.map(cat => cat.category), // Flatten category layer
            comments: post.comments.length,
        }));

        return NextResponse.json({
            items: formattedPosts,
            pagination: page && limit ? {
                total: totalPosts,
                page,
                limit,
                totalPages: Math.ceil(totalPosts / limit),
            } : null,
        });
    } catch (error) {
        return NextResponse.json({ status: responseStatus.error, message: error || 'Something went wrong' }, { status: 400 });
    }
}
