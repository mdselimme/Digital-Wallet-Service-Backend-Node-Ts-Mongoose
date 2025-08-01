import { Wallet } from "./wallet.model";
import httpStatusCodes from 'http-status-codes';
import { AppError } from '../../utils/AppError';
import { JwtPayload } from "jsonwebtoken";




const getMySingleWallet = async (walletId: string, decodedToken: JwtPayload) => {

    if (decodedToken.walletId !== walletId) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, "You are not authorized user.")
    }

    const result = await Wallet.findById(walletId).populate("transaction").lean();


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
    getAllWalletData
}