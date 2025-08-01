"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionDataZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.transactionDataZodSchema = zod_1.default.object({
    receiverEmail: zod_1.default
        .email({ error: "money receiver email need and type is string." }),
    senderPassword: zod_1.default
        .string({ error: "Sender password need and password type is string." }),
    amount: zod_1.default
        .number({ error: "amount is number type and value need greater then 0." })
        .min(1, { error: "Minimum value need 0" })
});
