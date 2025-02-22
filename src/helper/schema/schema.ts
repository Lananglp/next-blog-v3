import * as z from 'zod'

export const postSchema = z.object({
    title: z.string().min(1, "Title is required").min(5, "Minimum 3 characters required").max(100, "The word is too long"),
    content: z.string().min(30, "Content is required"),
    excerpt: z.string().min(1, "Summary is required").min(10, "Minimum 10 characters required").max(200, "The word is too long"),
    slug: z.string().min(1, "Slug is required").min(3, "Slug is required").max(150, "The word is too long"),
    status: z.enum(["publish", "draft", "private"]),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    authorId: z.string(),
    featuredImage: z.string().min(1, "Thumbnail is required").url(),
    commentStatus: z.enum(["open", "closed"]),
    meta: z.object({
        title: z.string().max(100, "The word is too long"),
        description: z.string().max(200, "The word is too long"),
        keywords: z.array(z.string()),
        ogImage: z.string(),
    }),
});

export type PostFormValues = z.infer<typeof postSchema>;