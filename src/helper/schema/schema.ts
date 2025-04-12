import * as z from 'zod'

// ============================= Post create & edit =============================
export const postSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required").min(5, "Minimum 10 characters required").max(100, "The word is too long"),
    content: z.string().min(1, "Content is required").min(30, "Minimum 30 characters required"),
    description: z.string().min(1, "Summary is required").min(10, "Minimum 10 characters required").max(200, "The word is too long"),
    status: z.enum(["PUBLISH", "DRAFT"]),
    categories: z.array(z.string()).min(1, "1 category is required"),
    tags: z.array(z.string()).min(1, "1 tag is required"),
    authorId: z.string().optional(),
    image: z.string().url("The URL is not valid"),
    altText: z.string(),
    commentStatus: z.enum(["OPEN", "CLOSED"]),
    meta: z.object({
        title: z.string(),
        description: z.string(),
        keywords: z.array(z.string()),
        image: z.string(),
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

// ============================= User create & edit =============================
export const userSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required").max(25, "Name maximum 25 characters"),
    username: z
        .string()
        .min(1, "Username is required")
        .max(25, "Maximum 25 characters")
        .regex(/^[a-z0-9._]+$/, {
            message: "Username can only contain lowercase letters, numbers, dots, and underscores",
        }),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    image: z.string().optional(),
    role: z.enum(["ADMIN", "USER"]).default("USER"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password minimum 8 characters")
        .max(32, "Password maximum 32 characters")
        .regex(/[a-z]/, "Password must contain lowercase letters")
        .regex(/[A-Z]/, "Password must contain uppercase letters")
        .regex(/[0-9]/, "Password must contain numbers")
        .regex(/[\W_]/, "Password must contain special characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    imageFile: z.instanceof(File).optional(),
});

export type UserFormType = z.infer<typeof userSchema>;

// ============================= User create & edit =============================
export const userEditSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Name is required").max(25, "Name maximum 25 characters"),
    username: z
        .string()
        .min(1, "Username is required")
        .max(25, "Maximum 25 characters")
        .regex(/^[a-z0-9._]+$/, {
            message: "Username can only contain lowercase letters, numbers, dots, and underscores",
        }),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    image: z.string().optional(),
    role: z.enum(["ADMIN", "USER"]).default("USER"),
    password: z.string().optional(),
    imageFile: z.instanceof(File).optional(),
});

export type UserEditFormType = z.infer<typeof userEditSchema>;
export type UserFormTypeWithoutFile = Omit<UserFormType, 'imageFile'>;

// ============================= User create & edit =============================
export const userProfileSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Name is required").max(25, "Name maximum 25 characters"),
    username: z
        .string()
        .min(1, "Username is required")
        .max(25, "Maximum 25 characters")
        .regex(/^[a-z0-9._]+$/, {
            message: "Username can only contain lowercase letters, numbers, dots, and underscores",
        }),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    image: z.string().optional(),
    bio: z.string().max(100, "bio maximum 100 characters").optional(),
    phone_1: z.string().optional(),
    phone_2: z.string().optional(),
    url_1: z.preprocess(
        (val) => (val === "" ? undefined : val),
        z.string().url("The URL is not valid").optional()
    ),
    url_2: z.preprocess(
        (val) => (val === "" ? undefined : val),
        z.string().url("The URL is not valid").optional()
    ),
    role: z.enum(["ADMIN", "USER"]).default("USER"),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    imageFile: z.instanceof(File).optional(),
});

export type UserProfileFormType = z.infer<typeof userProfileSchema>;
export type UserProfileFormTypeWithoutFile = Omit<UserFormType, 'imageFile'>;

// ============================= Comment create & edit =============================
const BaseCommentSchema = z.object({
    id: z.string().uuid(),
    content: z.string().min(1, "Comment is required").max(1000, "The word is too long"),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    postId: z.string().uuid(),
    author: z.object({
        id: z.string().uuid(),
        name: z.string(),
        image: z.string(),
    }),
    authorId: z.string().uuid(),
    parentId: z.string().uuid().nullable(), // Bisa null jika ini komentar utama
    likes: z.array(
        z.object({
            commentId: z.string().uuid(),
            userId: z.string().uuid(),
        }),
    ), // Array userId yang like komentar
    replyToUser: z.object({
        id: z.string().uuid(),
        name: z.string(),
        image: z.string(),
    }),
    replyToUserId: z.string().uuid(),
});

// Skema dengan nested replies (rekursi aman)
export const CommentSchema: z.ZodType<CommentType> = BaseCommentSchema.extend({
    replies: z.lazy(() => z.array(CommentSchema)).optional(), // Rekursi aman
});
export const CommentCreateSchema = BaseCommentSchema.omit({
    id: true,
    postId: true,
    createdAt: true,
    updatedAt: true,
    author: true,
    likes: true,
    replyToUser: true,
    replyToUserId: true,
}).extend({
    slug: z.string(),
});

// TypeScript type dari Zod Schema
export type CommentType = z.infer<typeof BaseCommentSchema> & {
    replies?: CommentType[];
};

export type CommentCreateFormType = z.infer<typeof CommentCreateSchema> & {
    slug: string;
};

// ============================= comment like toggle =============================
export const LikeSchema = z.object({
    commentId: z.string().uuid(),
    userId: z.string().uuid(),
});

export type LikeCreateFormType = z.infer<typeof LikeSchema>;