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
        .string({ error: "Password must be string type." })
        .min(5, { message: "Password minimum 5 characters long." })
        .max(5, { message: "Password maximum 5 characters long." })
        .regex(/^(?!0).{5}$/, { message: "Password must be five character long and not started with 0." }),
});