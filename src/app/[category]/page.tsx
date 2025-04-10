import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import CategoryShow from "./category-show";
import { CategoriesType } from "@/types/category-type";
import { Metadata } from "next";

type CategoryWithPostType = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    posts: {
        altText: string | null | undefined;
        title: string;
        description: string;
        image: string;
        createdAt: Date;
        author: {
            name: string;
        };
    };
}

interface CategoryPageProps {
    params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const category = decodeURIComponent((await params).category);
    const categoryName = category.replace(/-/g, " ");
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://example.com";
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "";

    const data = await prisma.category.findFirst({
        where: {
            name: {
                equals: categoryName,
                mode: "insensitive",
            },
        },
    });

    if (!data) {
        return {
            title: "Category Not Found",
            description: "The requested category does not exist.",
        };
    }

    return {
        title: `Category: ${data.name}`,
        description: `Explore posts in the ${data.name} category`,
        keywords: data.name,
        applicationName: appName,
        robots: {
            index: true,
            follow: true,
            nocache: true,
        },
        openGraph: {
            title: `Category: ${data.name}`,
            description: `Explore posts in the ${data.name} category`,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `Category: ${data.name}`,
            description: `Explore posts in the ${data.name} category`,
        },
        alternates: {
            canonical: `${baseUrl}/${category}`,
        },
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const category = decodeURIComponent((await params).category);
    const categoryName = category.replace(/-/g, " ");

    // console.log("Category:", category);
    // console.log("Slug:", slug);


    const data = await prisma.category.findFirst({
        where: {
            name: {
                equals: categoryName,
                mode: "insensitive",
            },
        },
        include: {
            posts: {
                take: 1,
                select: {
                    post: {
                        select: {
                            altText: true,
                            title: true,
                            description: true,
                            image: true,
                            createdAt: true,
                            author: {
                                select: {
                                    name: true,
                                }
                            },
                        }
                    }
                }
            },
        }
    });

    const formattedItems: CategoryWithPostType = {
        ...data || {
            id: "",
            name: "",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        posts: data?.posts[0].post || {
            altText: "",
            title: "",
            description: "",
            image: "",
            createdAt: new Date(),
            author: {
                name: "",
            },
        }
    }

    if (!data) {
        return notFound();
    }

    return (
        <CategoryShow category={formattedItems} />
    );
}
