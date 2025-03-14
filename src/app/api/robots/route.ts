import { NextResponse } from "next/server";

export async function GET() {
    const siteUrl = process.env.NEXT_PUBLIC_API_URL!;

    const robotsTxt = `
User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Sitemap: ${siteUrl}/api/sitemap
    `.trim();

    return new NextResponse(robotsTxt, {
        headers: {
            "Content-Type": "text/plain",
        },
    });
}