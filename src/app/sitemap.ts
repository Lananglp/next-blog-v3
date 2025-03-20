import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://yourdefaultdomain.com";
    const staticPages = ["/", "/about", "/login", "/register", "/posts"];
    

    // Ambil semua post dengan kategori
    const posts = await prisma.post.findMany({
        select: {
            slug: true,
            categories: {
                select: {
                    category: {
                        select: { name: true },
                    },
                },
            },
        },
    });

    // Ambil semua kategori
    const categories = await prisma.category.findMany({
        select: { name: true },
    });

    // Generate URL untuk post
    const postUrls = posts.map((post) => {
        const category =
            post.categories.length > 0
                ? encodeURIComponent(post.categories[0].category.name.replace(/\s+/g, "-").toLowerCase())
                : "uncategorized";

        return {
            url: `${baseUrl}/post/${category}/${post.slug}`,
            lastModified: new Date().toISOString(),
        };
    });

    // Generate URL untuk kategori
    const categoryUrls = categories.map((category) => {
        const parseCategory = encodeURIComponent(category.name.replace(/\s+/g, "-").toLowerCase());
        return {
            url: `${baseUrl}/${parseCategory}`,
            lastModified: new Date().toISOString(),
        };
    });

    return [
        ...staticPages.map((path) => ({
            url: `${baseUrl}${path}`,
            lastModified: new Date().toISOString(),
        })),
        ...postUrls,
        ...categoryUrls,
    ];
}
