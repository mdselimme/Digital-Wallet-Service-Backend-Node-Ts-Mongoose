import { model, Schema } from "mongoose";
import { IWallet } from "./wallet.interface";




const walletSchemaModel = new Schema<IWallet>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User id is required."]
    },
    balance: {
        type: Number,
        required: [true, "Balance is required."]
    },
    transaction: {
        type: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
        required: [true, "transaction id is required."],
        default: []
    }
}, {
    versionKey: false,
    timestamps: true
});

export const Wallet = model<IWallet>("Wallet", walletSchemaModel);