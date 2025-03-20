import { JsonValue } from "@prisma/client/runtime/library";

export type PostType = {
    id: string;
    author: {
        id: string;
        name: string;
        email: string;
        image: string | null;
        followers: {
            followerId: string;
            follower: {
                name: string;
            }
        }[];
        following: {
            followedId: string;
            followed: {
                name: string;
            }
        }[];
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
    altText: string | null | undefined;
    commentStatus: "OPEN" | "CLOSED" | string;
    meta: {
        title: string;
        description: string;
        keywords: string[];
        ogImage: string;
    };
    metaTitle: string | null | undefined;
    metaDescription: string | null | undefined;
    metaKeywords: string[];
    metaImage: string | null | undefined;
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
        followers: [],
        following: [],
    },
    meta: {
        title: "",
        description: "",
        keywords: [],
        ogImage: "",
    },
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
    metaImage: "",
    createdAt: new Date(),
    updatedAt: new Date(),
};