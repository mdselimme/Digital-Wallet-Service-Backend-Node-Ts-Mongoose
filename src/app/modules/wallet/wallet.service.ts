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

export const WalletService = { getMySingleWallet }