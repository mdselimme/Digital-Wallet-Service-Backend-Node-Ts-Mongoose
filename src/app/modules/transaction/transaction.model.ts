import { Schema } from "mongoose";
import { ITransaction } from "./transaction.interface";






const transactionSchemaModel = new Schema<ITransaction>({
    _id: {
        type: Schema.Types.ObjectId
    }
})