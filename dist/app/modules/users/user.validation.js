"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoleZodSchema = exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
// Create User Validation 
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string("Name must be string")
        .min(2, { message: "Name too short. Minimum 2 character long" })
        .max(50, { message: "Name too long. Max 50 characters" }),
    email: zod_1.default
        .email("Email must be string.")
        .min(5, "Email must be 5 character long.")
        .max(100, { message: "Email cannot exceed 100 character." }),
    phone: zod_1.default.string()
        .min(11, "Phone number is too short")
        .max(14, "Phone number is too long")
        .regex(/^(01|\+8801)\d{9}$/, "Invalid Bangladeshi phone number. It must start with '01' or '+8801' and be 11 or 13 digits long respectively."),
    role: zod_1.default
        .enum(Object.values(user_interface_1.IUserRole), { error: "Value must be from these (User | Agent)" }),
    password: zod_1.default
        .string({ error: "Password must be string type." })
        .min(5, { message: "Password minimum 5 characters long." })
        .max(5, { message: "Password maximum 5 characters long." })
        .regex(/^(?!0).{5}$/, { message: "Password must be five character long and not started with 0." }),
});
// Update User Validation 
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string("Name must be string")
        .min(2, { message: "Name too short. Minimum 2 character long" })
        .max(50, { message: "Name too long. Max 50 characters" })
        .optional(),
    email: zod_1.default
        .email("Email must be string.")
        .min(5, "Email must be 5 character long.")
        .max(100, { message: "Email cannot exceed 100 character." })
        .optional(),
    address: zod_1.default
        .string({ error: "address must be string." })
        .optional(),
    phone: zod_1.default.string()
        .min(11, "Phone number is too short")
        .max(14, "Phone number is too long")
        .regex(/^(01|\+8801)\d{9}$/, "Invalid Bangladeshi phone number. It must start with '01' or '+8801' and be 11 or 13 digits long respectively.").optional(),
});
exports.updateRoleZodSchema = zod_1.default.object({
    role: zod_1.default
        .enum(Object.values(user_interface_1.IUserRole), { error: "Value must be from these (User | Admin | Agent)" })
});
