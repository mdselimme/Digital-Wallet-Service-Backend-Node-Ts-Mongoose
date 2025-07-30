import { Types } from "mongoose";

export enum IPaymentType {
    CASH_IN = "CASH_IN",
    SEND_MONEY = "SEND_MONEY",
    CASH_OUT = "CASH_OUT",
    BONUS = "BONUS",
};


export interface ITransaction {
    _id: Types.ObjectId,
    send: Types.ObjectId,
    to: Types.ObjectId,
    amount: number,
    fee: number,
    type: IPaymentType
}