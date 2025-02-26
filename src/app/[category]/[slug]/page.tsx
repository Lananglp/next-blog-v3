import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Template from "@/components/template-custom";
import PostShow from "./post-show";

interface PostPageProps {
    params: Promise<{ category: string; slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
    const { category, slug } = await params;

    // console.log("Category:", category);
    // console.log("Slug:", slug);

    const post = await prisma.post.findFirst({
        where: {
            slug: {
                equals: slug,
            },
            categories: {
                some: {
                    category: {
                        name: category,
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
                    category: {
                        select: {
                            id: true,
                            name: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                },
            },
        },
    });

    // console.log(post);

    if (!post) {
        return notFound();
    }

    return (
        <Template>
            <PostShow post={post} />
        </Template>
    );
}
