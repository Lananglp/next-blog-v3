import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Template from "@/components/template-custom";
import CategoryShow from "./category-show";

interface CategoryPageProps {
    params: Promise<{ category: string }>;
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
            posts: true,
        }
    });

    if (!data) {
        return notFound();
    }

    return (
        <Template>
            <CategoryShow category={data} />
        </Template>
    );
}
