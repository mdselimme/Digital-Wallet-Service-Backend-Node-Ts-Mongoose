import { Wallet } from "./wallet.model";
import httpStatusCodes from 'http-status-codes';
import { AppError } from '../../utils/AppError';
import { JwtPayload } from "jsonwebtoken";
import { IUserRole } from "../users/user.interface";
import { Transaction } from "../transaction/transaction.model";
import { IPaymentType, ITransaction, ITransFee } from "../transaction/transaction.interface";


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
        successful: true,
        fee: ITransFee.Free,
        commission: ITransFee.Free,
        type: IPaymentType.ADD_MONEY_DIGITAL
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
const getSingleWallet = async (walletId: string) => {

    const result = await Wallet.findById(walletId)
        .populate("transaction").lean();

    if (!result) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, "Wallet data not found.")
    };

    return result;

};

// Get all wallet data 
const getAllWalletData = async (limit: number, sort: string) => {

    let dataLimit = 10
    let sortData: 1 | -1 = -1;

    if (sort === "asc") {
        sortData = 1
    } else {
        sortData = -1
    }

    if (limit) {
        dataLimit = Number(limit)
    }

    const result = await Wallet.find({})
        .select("-transaction -updatedAt")
        .populate("user", "name email role phone")
        .limit(dataLimit)
        .sort({ createdAt: sortData });
    const total = await Wallet.countDocuments();

    if (!result) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, "Wallet data not found.")
    };

    return {
        total: {
            count: total,
            limit: dataLimit,
            sort: sort
        },
        result
    };

};

// Get all wallet data 
const getMyWallet = async (decodedToken: JwtPayload) => {

    const wallet = await Wallet.findById(decodedToken.walletId)
        .populate("user", "name email phone type").select("-transaction");

    if (!wallet) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, "Wallet data not found.")
    }

    return wallet;

};

export const WalletService = {
    getSingleWallet,
    getAllWalletData,
    getMyWallet,
    addMoneyToSuperAdminWallet
}