import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Template from "@/components/template-custom";
import PostShow from "./post-show";
import { initialPost, PostType } from "@/types/post-type";
import { Metadata } from "next";

interface PostPageProps {
    params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const category = decodeURIComponent((await params).category);
    const slug = (await params).slug;
    const categoryName = category.replace(/-/g, " ");

    const post = await prisma.post.findFirst({
        where: {
            slug: {
                equals: slug,
            },
            categories: {
                some: {
                    category: {
                        name: {
                            equals: categoryName,
                            mode: "insensitive",
                        },
                    },
                },
            },
        },
        select: {
            title: true,
            excerpt: true,
            featuredImage: true,
            createdAt: true,
            updatedAt: true,
            author: {
                select: {
                    name: true,
                },
            },
        },
    });

    if (!post) {
        return {
            title: "Post Not Found",
            description: "The requested post does not exist.",
        };
    }

    return {
        title: post.title,
        description: post.excerpt || "Read this amazing post.",
        openGraph: {
            title: post.title,
            description: post.excerpt || "Read this amazing post.",
            images: post.featuredImage ? [{ url: post.featuredImage }] : [],
            type: "article",
            publishedTime: post.createdAt.toISOString(),
            modifiedTime: post.updatedAt.toISOString(),
            authors: post.author ? [post.author.name] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt || "Read this amazing post.",
            images: post.featuredImage ? [post.featuredImage] : [],
        },
        alternates: {
            canonical: `/post/${category}/${slug}`,
        },
    };
}

export default async function PostPage({ params }: PostPageProps) {
    const category = (await params).category;
    const slug = (await params).slug;
    const categoryName = category.replace(/-/g, " ");

    const post = await prisma.post.findFirst({
        where: {
            slug: {
                equals: slug,
            },
            categories: {
                some: {
                    category: {
                        name: {
                            equals: categoryName,
                            mode: "insensitive",
                        },
                    },
                },
            },
        },
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
                select: {
                    category: true,
                },
            },
        },
    });

    const formattedPost: PostType = {
        ...post || initialPost,
        categories: post?.categories.map((cat) => cat.category) || [],
    };

    if (!post) {
        return notFound();
    }

    return (
        <Template>
            <PostShow post={formattedPost} />
        </Template>
    );
}
