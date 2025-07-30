import { Types } from "mongoose";

export enum IPaymentType {
    CASH_IN = "CASH_IN",
    SEND_MONEY = "SEND_MONEY",
    CASH_OUT = "CASH_OUT",
    BONUS = "BONUS",
};

export enum ITransFee {
    Agent = 0.5,
    User = 1,
    Free = 0
}


export interface ITransaction {
    _id?: Types.ObjectId,
    send: Types.ObjectId,
    to: Types.ObjectId,
    amount: number,
    fee: ITransFee,
    type: IPaymentType
}