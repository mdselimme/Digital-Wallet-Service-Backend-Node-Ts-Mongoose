import z from "zod";


export const transactionDataZodSchema = z.object({
    receiverEmail: z
        .email({ error: "money receiver email need and type is string." }),
    senderPassword: z
        .string({ error: "Sender password need and password type is string." }),
    amount: z
        .number({ error: "amount is number type and value need greater then 0." })
        .min(1, { error: "Minimum value need 0" })
})