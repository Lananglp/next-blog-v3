import * as z from 'zod'

// export const loginSchema = z.object({
//     email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
//     password: z
//         .string()
//         .min(1, "Password wajib diisi")
//         .min(8, "Password minimal 8 karakter")
//         .max(32, "Password maksimal 32 karakter")
//         .regex(/[a-z]/, "Password harus mengandung huruf kecil")
//         .regex(/[A-Z]/, "Password harus mengandung huruf besar")
//         .regex(/[0-9]/, "Password harus mengandung angka")
//         .regex(/[\W_]/, "Password harus mengandung karakter spesial"),
// });
export const loginSchema = z.object({
    credential: z.string().min(3, "Username or Email is required"),
    password: z.string().min(1, "Password is required"),
});

export type LoginFormType = z.infer<typeof loginSchema>;