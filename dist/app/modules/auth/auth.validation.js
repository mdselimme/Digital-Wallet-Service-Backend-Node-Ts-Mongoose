"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordZodValidation = exports.resetPasswordZodValidation = exports.authLogInZodValidation = void 0;
const zod_1 = __importDefault(require("zod"));
exports.authLogInZodValidation = zod_1.default.object({
    email: zod_1.default
        .email({ error: "Email must be string and email format." }),
    password: zod_1.default
        .string({ error: "Password required and string." })
});
exports.resetPasswordZodValidation = zod_1.default.object({
    oldPassword: zod_1.default.string({ error: "old password required and string type." }),
    newPassword: zod_1.default
        .string({ error: "Password must be string type." })
        .min(5, { message: "Password minimum 5 characters long." })
        .max(5, { message: "Password maximum 5 characters long." })
        .regex(/^(?!0).{5}$/, { message: "Password must be five character long and not started with 0." }),
});
exports.forgotPasswordZodValidation = zod_1.default.object({
    email: zod_1.default
        .email({ error: "Email must be string and email format." }),
});
