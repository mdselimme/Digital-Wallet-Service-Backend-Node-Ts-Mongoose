import z from "zod";





export const contactFormSchema = z.object({
    name: z.string().min(3, { error: "Enter your name min 3 character length" }),
    email: z.email({ error: "Must be a valid email." }),
    subject: z
        .string()
        .min(10, { error: "write your subject min 10 character." }),
    phone: z
        .string()
        .length(11, { message: "Phone number must be exactly 11 digits" })
        .regex(/^01\d{9}$/, {
            message:
                "Invalid Bangladeshi phone number. It must start with '01' and be exactly 11 digits long.",
        }),
    message: z
        .string()
        .min(10, { error: "write your subject min 10 character." }),
})