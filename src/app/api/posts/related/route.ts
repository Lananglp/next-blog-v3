import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import stringSimilarity from "string-similarity";

// Fungsi untuk mengambil postingan terkait berdasarkan kategori, judul, dan waktu
async function getRelatedPostsByCategoryAndTitle(slug: string) {
    const currentPost = await prisma.post.findUnique({
        where: { slug },
        include: { categories: true },
    });

    if (!currentPost) return [];

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const relatedPosts = await prisma.post.findMany({
        where: {
            categories: {
                some: {
                    category: {
                        id: { in: currentPost.categories.map((cat) => cat.categoryId) }
                    }
                }
            },
            createdAt: { gte: oneWeekAgo },
            NOT: { slug: currentPost.slug },
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            },
            categories: {
                select: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            },
        },
        take: 10, // Ambil lebih banyak untuk filtering
    });

    return relatedPosts
        .map((post) => ({
            ...post,
            similarity: stringSimilarity.compareTwoStrings(currentPost.title, post.title),
            categories: post.categories.map(cat => cat.category),
        }))
        .filter((post) => post.similarity >= 0.1) // default 0.8 = mirip 70%
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 2);
}

// Fungsi untuk mengambil postingan terkait berdasarkan kategori dan author
async function getRelatedPostsByCategoryAndAuthor(slug: string) {
    const currentPost = await prisma.post.findUnique({
        where: { slug },
        include: { categories: true },
    });

    if (!currentPost) return [];

    const posts = await prisma.post.findMany({
        where: {
            categories: {
                some: {
                    category: {
                        id: { in: currentPost.categories.map((cat) => cat.categoryId) }
                    }
                }
            },
            authorId: currentPost.authorId,
            NOT: { slug: currentPost.slug },
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            },
            categories: {
                select: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            },
        },
        take: 2,
    });

    return posts
        .map((post) => ({
            ...post,
            categories: post.categories.map(cat => cat.category),
        }))
}

// Fungsi untuk mengambil 10 postingan random berdasarkan kemiripan judul
async function getRandomPosts(slug: string) {
    const currentPost = await prisma.post.findUnique({
        where: { slug },
    });

    if (!currentPost) return [];

    const randomPosts = await prisma.post.findMany({
        where: { NOT: { slug: currentPost.slug } },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            },
            categories: {
                select: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            },
        },
        take: 20, // Ambil lebih banyak untuk filtering
        orderBy: { createdAt: "desc" },
    });

    return randomPosts
        .map((post) => ({
            ...post,
            similarity: stringSimilarity.compareTwoStrings(currentPost.title, post.title),
            categories: post.categories.map(cat => cat.category),
        }))
        .filter((post) => post.similarity >= 0.1) // default 0.4 = mirip 40%
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
}

// API Route untuk mendapatkan postingan terkait
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const slugParam = searchParams.get('slug');

    try {
        const [relatedByCategory, relatedByAuthor, randomPosts] = await Promise.all([
            getRelatedPostsByCategoryAndTitle(slugParam || ""),
            getRelatedPostsByCategoryAndAuthor(slugParam || ""),
            getRandomPosts(slugParam || ""),
        ]);

        return NextResponse.json({ relatedByCategory, relatedByAuthor, randomPosts });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}
