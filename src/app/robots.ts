import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const siteUrl = process.env.NEXT_PUBLIC_API_URL || "https://yourdefaultdomain.com";
    

    return {
        rules: [
            {
                userAgent: "*",
                disallow: ["/admin/", "/api/", "/private/"],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
