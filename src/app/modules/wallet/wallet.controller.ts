import httpStatusCodes from 'http-status-codes';
import { Request, Response } from "express";
import { catchAsyncTryCatchHandler } from "../../utils/catchAsyncTryCatch"
import { sendResponse } from "../../utils/sendResponse";
import { WalletService } from './wallet.service';


// Get Single Wallet data 
const getMySingleWallet = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const decodedToken = req.user;

    const result = await WalletService.getMySingleWallet(req.params.id, decodedToken);

    sendResponse(res, {
        success: true,
        message: "Wallet retrieved successfully.",
        data: result,
        statusCode: httpStatusCodes.OK
    });
});

// Get All Wallet Data For admin 
const getAllWalletData = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const result = await WalletService.getAllWalletData();

    sendResponse(res, {
        success: true,
        message: "All Wallet retrieved successfully.",
        data: result,
        statusCode: httpStatusCodes.OK
    });
});


export const WalletController = {
    getMySingleWallet,
    getAllWalletData
}