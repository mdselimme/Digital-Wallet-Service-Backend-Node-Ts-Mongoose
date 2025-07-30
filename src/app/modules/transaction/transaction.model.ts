import { model, Schema } from "mongoose";
import { IPaymentType, ITransaction, ITransFee } from "./transaction.interface";






const transactionSchemaModel = new Schema<ITransaction>({
    // _id: {
    //     type: Schema.Types.ObjectId
    // },
    send: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Sender id is required."]
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Receiver id is required."]
    },
    amount: {
        type: Number,
        required: [true, "Amount is required."]
    },
    fee: {
        type: Number,
        enum: [0.5, 1, 0],
        default: ITransFee.Free
    },
    type: {
        type: String,
        enum: Object.values(IPaymentType),
        default: IPaymentType.BONUS
    }
}, {
    versionKey: false,
    timestamps: true
});


export const Transaction = model<ITransaction>("Transaction", transactionSchemaModel);