import z from "zod";
import { IUserModel } from "./user.interface";



// Create User Validation 
export const createUserZodSchema: z.ZodType<Partial<IUserModel>> = z.object({
    name: z
        .string("Name must be string")
        .min(2, { message: "Name too short. Minimum 2 character long" })
        .max(50, { message: "Name too long. Max 50 characters" }),
    email: z
        .email("Email must be string.")
        .min(5, "Email must be 5 character long.")
        .max(100, { message: "Email cannot exceed 100 character." }),
    password: z
        .string("password must be string.")
        .min(8, { message: "Password minimum 8 characters long." })
        .regex(/^(?=.*[A-Z])/, { message: "Password must be contain at least 1 uppercase letter" })
        .regex(/^(?=.*[a-z])/, { message: "Password must be contain at least 1 lowercase letter" })
        .regex(/^(?=.*[!@#$%^&*])/, { message: "Password must be contain at least 1 special character." })
        .regex(/^(?=.*)/, { message: "Password must be contain at least 1 number" }),
});

// Update User Validation 
export const updateUserZodSchema: z.ZodType<Partial<IUserModel>> = z.object({
    name: z
        .string("Name must be string")
        .min(2, { message: "Name too short. Minimum 2 character long" })
        .max(50, { message: "Name too long. Max 50 characters" })
        .optional(),
    email: z
        .email("Email must be string.")
        .min(5, "Email must be 5 character long.")
        .max(100, { message: "Email cannot exceed 100 character." }),
    address: z
        .string({ error: "address must be string." })
        .optional(),
    phone: z.string()
        .min(11, "Phone number is too short")
        .max(14, "Phone number is too long")
        .regex(
            /^(01|\+8801)\d{9}$/,
            "Invalid Bangladeshi phone number. It must start with '01' or '+8801' and be 11 or 13 digits long respectively."
        ).optional(),
});