import { Wallet } from "./wallet.model";
import httpStatusCodes from 'http-status-codes';
import { AppError } from '../../utils/AppError';
import { JwtPayload } from "jsonwebtoken";
import { IUserRole } from "../users/user.interface";
import { Transaction } from "../transaction/transaction.model";
import { IPaymentType, ITransaction, ITransFee } from "../transaction/transaction.interface";
import { User } from "../users/user.model";
import mongoose from "mongoose";

// add money to super admin wallet id 
const addMoneyToSuperAdminWallet = async (amount: number, decodedToken: JwtPayload) => {

    if (amount <= 0) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, "Amount must be greater than 0.")
    }

    if (decodedToken.role !== IUserRole.Super_Admin) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, "You are not authorized for this route.")
    }

    const wallet = await Wallet.findById(decodedToken.walletId);

    if (!wallet) {
        throw new AppError(httpStatusCodes.NOT_FOUND, "No wallet found.")
    }

    // transaction payload 
    const transactionPayload: ITransaction = {
        send: decodedToken.userId,
        to: decodedToken.userId,
        amount: amount,
        fee: ITransFee.Free,
        commission: ITransFee.Free,
        type: IPaymentType.ADD_MONEY
    };

    const transaction = await Transaction.create(transactionPayload);

    const newWalletBalance = Number(wallet.balance) + Number(transaction.amount);

    await Wallet.findByIdAndUpdate(decodedToken.walletId, {
        balance: newWalletBalance,
        $push: { "transaction": transaction._id }
    });

    return transaction;

};


// Get single wallet 
const getMySingleWallet = async (walletId: string, decodedToken: JwtPayload) => {

    if (decodedToken.role === IUserRole.Agent || decodedToken.role === IUserRole.User) {
        const user = await User.findById(decodedToken.userId);
        if (!user) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, "Not a valid user");
        }
        const walId = new mongoose.Types.ObjectId(walletId);
        const wallet = await Wallet.findById(decodedToken.walletId);
        if (!wallet) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, "Not a valid wallet.");
        }
        // check same user wallet transaction match 
        if (!user.walletId?.equals(walId) && !wallet._id.equals(walId)) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, "It's not your wallet.");
        }
    }
    const result = await Wallet.findById(walletId)
        .populate("transaction").lean();


    if (!result) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, "Wallet data not found.")
    };

    return result;

};

// Get all wallet data 
const getAllWalletData = async (limit: number) => {

    let dataLimit = 10

    if (limit) {
        dataLimit = Number(limit)
    }

    const result = await Wallet.find({}).populate("user", "name email role phone").limit(dataLimit);

    if (!result) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, "Wallet data not found.")
    };

    return result;

};

export const WalletService = {
    getMySingleWallet,
    getAllWalletData,
    addMoneyToSuperAdminWallet
}