import { PostFormValues } from "@/helper/schema/schema";
import { JsonValue } from "@prisma/client/runtime/library";

export type PostType = {
    id: string;
    author: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    }
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    status: "PUBLISH" | "DRAFT" | "PRIVATE";
    categories: {
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;        
        }
    }[];
    tags: string[];
    authorId: string;
    featuredImage: string;
    commentStatus: "OPEN" | "CLOSED";
    meta: JsonValue | {
        title: string;
        description: string;
        keywords: string;
        ogImage: string;
    };
    createdAt: Date;
    updatedAt: Date;
};