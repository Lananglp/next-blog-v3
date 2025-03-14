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
    status: "PUBLISH" | "DRAFT" | "PRIVATE" | string;
    categories: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
    tags: string[];
    authorId: string;
    featuredImage: string;
    altText: string | null;
    commentStatus: "OPEN" | "CLOSED" | string;
    meta: JsonValue | {
        title: string;
        description: string;
        keywords: string;
        ogImage: string;
    };
    createdAt: Date;
    updatedAt: Date;
};

export const initialPost = {
    id: "",
    title: "",
    content: "",
    excerpt: "",
    slug: "",
    status: "PUBLISH",
    categories: [],
    tags: [],
    authorId: "",
    featuredImage: "",
    altText: "",
    commentStatus: "OPEN",
    author: {
        id: "",
        name: "",
        email: "",
        image: "",
    },
    meta: {
        title: "",
        description: "",
        keywords: "",
        ogImage: "",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
};