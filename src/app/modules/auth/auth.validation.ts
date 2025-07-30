import z from "zod";

export const authLogInZodValidation = z.object({
    email: z
        .email("Email must be string and email format."),
    password: z
        .string({ error: "Password required and string." })
});


export const resetPasswordZodValidation = z.object({
    oldPassword: z.string({ error: "old password required and string type." }),
    newPassword: z
        .string({ error: "new password required and string type." })
        .min(8, { message: "Password minimum 8 characters long." })
        .regex(/^(?=.*[A-Z])/, { message: "Password must be contain at least 1 uppercase letter" })
        .regex(/^(?=.*[a-z])/, { message: "Password must be contain at least 1 lowercase letter" })
        .regex(/^(?=.*[!@#$%^&*])/, { message: "Password must be contain at least 1 special character." })
        .regex(/^(?=.*)/, { message: "Password must be contain at least 1 number" }),
});