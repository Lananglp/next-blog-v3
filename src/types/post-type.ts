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
    description: string;
    slug: string;
    status: "PUBLISH" | "DRAFT" | string;
    categories: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
    tags: string[];
    authorId: string;
    _count: {
        comments: number;
        likes: number;
    }
    image: string;
    altText: string | null | undefined;
    commentStatus: "OPEN" | "CLOSED" | string;
    likes: {
        postId: string,
        userId: string,
    }[],
    meta: {
        title: string;
        description: string;
        keywords: string[];
        image: string;
    } | null;
    createdAt: Date;
    updatedAt: Date;
};

export const initialPost = {
    id: "",
    title: "",
    content: "",
    description: "",
    slug: "",
    status: "DRAFT",
    categories: [],
    tags: [],
    authorId: "",
    image: "",
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
    likes: [],
    _count: {
        comments: 0,
        likes: 0,
    },
    meta: {
        title: "",
        description: "",
        keywords: [],
        image: "",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
};