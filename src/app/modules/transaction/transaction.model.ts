import { model, Schema } from "mongoose";
import { IPaymentType, ITransaction, ITransFee } from "./transaction.interface";
import { User } from "../users/user.model";






const transactionSchemaModel = new Schema<ITransaction>({
    // _id: {
    //     type: Schema.Types.ObjectId
    // },
    send: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: [true, "Sender id is required."]
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: User,
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