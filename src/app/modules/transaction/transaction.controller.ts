import httpStatusCodes from 'http-status-codes';
import { Request, Response } from "express";
import { catchAsyncTryCatchHandler } from "../../utils/catchAsyncTryCatch"
import { sendResponse } from "../../utils/sendResponse";
import { TransactionServices } from './transaction.service';



//Cash In Agent to User
const cashInTransfer = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const decodedToken = req.user;

    const transaction = await TransactionServices.cashInTransfer(req.body, decodedToken);

    sendResponse(res, {
        success: true,
        message: "Cash In Successful.",
        data: transaction,
        statusCode: httpStatusCodes.OK
    });
});

// Send Money User to User 
const sendMoneyTransfer = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const decodedToken = req.user;

    const transaction = await TransactionServices.sendMoneyTransfer(req.body, decodedToken);

    sendResponse(res, {
        success: true,
        message: "Send Money Successful.",
        data: transaction,
        statusCode: httpStatusCodes.OK
    });
});

// User Cash Out 
const userCashOutAgent = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const decodedToken = req.user;

    const transaction = await TransactionServices.userCashOutAgent(req.body, decodedToken);

    sendResponse(res, {
        success: true,
        message: "Cash Out Successful.",
        data: transaction,
        statusCode: httpStatusCodes.OK
    });
});



export const TransactionController = {
    cashInTransfer,
    sendMoneyTransfer,
    userCashOutAgent
}