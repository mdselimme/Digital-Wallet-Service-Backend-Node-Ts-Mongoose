import z from "zod";

export const authLogInZodValidation = z.object({
    email: z
        .email("Email must be string and email format."),
    password: z
        .string("password must be string.")
});