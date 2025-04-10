import * as z from 'zod'

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required").max(25, "Maximum 25 characters"),
    username: z
        .string()
        .min(1, "Username is required")
        .max(25, "Maximum 25 characters")
        .regex(/^[a-z0-9._]+$/, {
            message: "Username can only contain lowercase letters, numbers, dots, and underscores",
        }),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password minimum 8 characters")
        .max(32, "Password maximum 32 characters")
        .regex(/[a-z]/, "Password must contain lowercase letters")
        .regex(/[A-Z]/, "Password must contain uppercase letters")
        .regex(/[0-9]/, "Password must contain numbers")
        .regex(/[\W_]/, "Password must contain special characters"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
});