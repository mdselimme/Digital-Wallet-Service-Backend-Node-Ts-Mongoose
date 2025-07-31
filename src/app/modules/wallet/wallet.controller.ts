import httpStatusCodes from 'http-status-codes';
import { Request, Response } from "express";
import { catchAsyncTryCatchHandler } from "../../utils/catchAsyncTryCatch"
import { sendResponse } from "../../utils/sendResponse";
import { WalletService } from './wallet.service';



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



export const WalletController = { getMySingleWallet }