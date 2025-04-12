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
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://example.com";
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "";

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
            description: true,
            image: true,
            createdAt: true,
            updatedAt: true,
            author: {
                select: {
                    name: true,
                    username: true,
                },
            },
            meta: true,
        },
    });

    if (!post) {
        return {
            title: "Post Not Found",
            description: "The requested post does not exist.",
        };
    }

    return {
        title: post.meta?.title || post.title,
        description: post.meta?.description || post.description,
        keywords: post.meta?.keywords || post.title,
        applicationName: appName,
        robots: {
            index: true,
            follow: true,
            nocache: true,
        },
        authors: post.author ? [{
            name: post.author.name,
            url: `${baseUrl}/profile/${post.author.username}`,
        }] : [
            {
                name: "Blog",
                url: "",
            },
        ],
        openGraph: {
            title: post.meta?.title || post.title,
            description: post.meta?.description || post.description,
            images: post.meta?.image ? [{ url: post.meta?.image }] : post.image ? [{ url: post.image }] : [],
            type: "article",
            publishedTime: post.createdAt.toISOString(),
            modifiedTime: post.updatedAt.toISOString(),
            authors: post.author ? [post.author.name] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.meta?.description || post.description,
            images: post.meta?.image ? [post.meta?.image] : post.image ? [post.image] : [],
        },
        alternates: {
            canonical: `${baseUrl}/${category}/${slug}`,
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
                    followers: {
                        select: {
                            follower: {
                                select: {
                                    name: true
                                }
                            },
                            followerId: true,
                        }
                    },
                    following: {
                        select: {
                            followed: {
                                select: {
                                    name: true
                                }
                            },
                            followedId: true,
                        }
                    }
                },
            },
            categories: {
                select: {
                    category: true,
                },
            },
            meta: true,
            _count: {
                select: {
                    comments: true,
                    likes: true,
                },
            },
            likes: {
                select: {
                    postId: true,
                    userId: true,
                }
            }
        },
    });

    const formattedPost: PostType = {
        ...post || initialPost,
        categories: post?.categories.map((cat) => cat.category) || [],
    };

    if (!post || post.status === "DRAFT") {
        return notFound();
    }

    return (
        <Template>
            <PostShow post={formattedPost} />
        </Template>
    );
}
