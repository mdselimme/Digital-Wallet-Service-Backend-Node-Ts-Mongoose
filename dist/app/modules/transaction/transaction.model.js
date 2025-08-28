"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("./transaction.interface");
const user_model_1 = require("../users/user.model");
const transactionSchemaModel = new mongoose_1.Schema({
    // _id: {
    //     type: Schema.Types.ObjectId
    // },
    send: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: user_model_1.User,
        required: [true, "Sender id is required."]
    },
    to: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: user_model_1.User,
        required: [true, "Receiver id is required."]
    },
    amount: {
        type: Number,
        required: [true, "Amount is required."]
    },
    successful: {
        type: Boolean,
        required: true
    },
    commission: {
        type: Number,
        required: [true, "Commission is required."]
    },
    fee: {
        type: Number,
        default: transaction_interface_1.ITransFee.Free
    },
    type: {
        type: String,
        enum: Object.values(transaction_interface_1.IPaymentType),
        default: transaction_interface_1.IPaymentType.BONUS
    }
}, {
    versionKey: false,
    timestamps: true
});
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchemaModel);
