"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = require("mongoose");
const walletSchemaModel = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User id is required."]
    },
    balance: {
        type: Number,
        required: [true, "Balance is required."]
    },
    transaction: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Transaction" }],
        required: [true, "transaction id is required."],
        default: []
    }
}, {
    versionKey: false,
    timestamps: true
});
exports.Wallet = (0, mongoose_1.model)("Wallet", walletSchemaModel);
