import z from "zod";





export const contactFormSchema = z.object({
    name: z.string().min(3, { error: "Enter your name min 3 character length" }),
    email: z.email({ error: "Must be a valid email." }),
    subject: z
        .string()
        .min(10, { error: "write your subject min 10 character." }),
    message: z
        .string()
        .min(10, { error: "write your subject min 10 character." }),
})