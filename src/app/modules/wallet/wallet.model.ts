import { model, Schema } from "mongoose";
import { IWallet } from "./wallet.interface";




const walletSchemaModel = new Schema<IWallet>({
    user: {
        type: Schema.Types.ObjectId,
        required: [true, "User id is required."]
    },
    balance: {
        type: Number,
        required: [true, "Balance is required."]
    },
    transaction: {
        type: [Schema.Types.ObjectId],
        required: [true, "transaction id is required."]
    }
}, {
    versionKey: false,
    timestamps: true
});

export const Wallet = model<IWallet>("Wallet", walletSchemaModel);