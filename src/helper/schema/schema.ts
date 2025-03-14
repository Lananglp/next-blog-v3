import * as z from 'zod'

export const postSchema = z.object({
    title: z.string().min(1, "Title is required").min(5, "Minimum 5 characters required").max(100, "The word is too long"),
    content: z.string().min(1, "Content is required").min(30, "Minimum 30 characters required"),
    excerpt: z.string().min(1, "Summary is required").min(10, "Minimum 10 characters required").max(200, "The word is too long"),
    slug: z.string().min(1, "Slug is required").min(5, "Minimum 5 characters required").max(150, "The word is too long"),
    status: z.enum(["PUBLISH", "DRAFT", "PRIVATE"]),
    categories: z.array(z.string()).min(1, "1 category is required"),
    tags: z.array(z.string()).min(1, "1 tag is required"),
    authorId: z.string(),
    featuredImage: z.string().url("The URL is not valid"),
    altText: z.string(),
    commentStatus: z.enum(["OPEN", "CLOSED"]),
    meta: z.object({
        title: z.string().max(100, "The word is too long"),
        description: z.string().max(200, "The word is too long"),
        keywords: z.array(z.string()),
        ogImage: z.string(),
    }),
});

export type PostFormValues = z.infer<typeof postSchema>;

// ============================= Category create =============================
export const categoryCreateSchema = z.object({
    categories: z.array(z.object({ name: z.string() })),
});

export type CategoryCreateFormType = z.infer<typeof categoryCreateSchema>;

// ============================= Category edit =============================
export const categoryEditSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: 'Category name is required' }),
});

export type CategoryEditFormType = z.infer<typeof categoryEditSchema>;