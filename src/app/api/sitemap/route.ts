import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Fungsi untuk escape karakter khusus dalam XML
// function escapeXml(unsafe: string) {
//     return unsafe
//         .replace(/&/g, "&amp;") // Ubah "&" menjadi "&amp;"
//         .replace(/</g, "&lt;") // Ubah "<" menjadi "&lt;"
//         .replace(/>/g, "&gt;") // Ubah ">" menjadi "&gt;"
//         .replace(/"/g, "&quot;") // Ubah '"' menjadi "&quot;"
//         .replace(/'/g, "&apos;"); // Ubah "'" menjadi "&apos;"
// }

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://yourdefaultdomain.com";
    const staticPages = ["/", "/about", "/contact"];

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
                : "uncategorized"; // Fallback jika post tidak punya kategori

        return `<url><loc>${`${baseUrl}/post/${category}/${post.slug}`}</loc></url>`;
    });

    // Generate URL untuk kategori
    const categoryUrls = categories.map((category) => {
        const parseCategory = encodeURIComponent(category.name.replace(/\s+/g, "-").toLowerCase());
return `<url><loc>${baseUrl}/${parseCategory}</loc></url>`;

    });

    // Buat XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${staticPages.map((path) => `<url><loc>${`${baseUrl}${path}`}</loc></url>`).join("")}
        ${postUrls.join("")}
        ${categoryUrls.join("")}
    </urlset>`.trim();

    return new NextResponse(sitemap, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
