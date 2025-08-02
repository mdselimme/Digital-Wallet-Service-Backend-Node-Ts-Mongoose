import httpStatusCodes from 'http-status-codes';
import { Request, Response } from "express";
import { catchAsyncTryCatchHandler } from "../../utils/catchAsyncTryCatch"
import { sendResponse } from "../../utils/sendResponse";
import { TransactionServices } from './transaction.service';
import { Transaction } from './transaction.model';
import { AppError } from '../../utils/AppError';



// Add Money User and Agent 
const addMoneyToAgent = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const decodedToken = req.user;

    const transaction = await TransactionServices.addMoneyToAgent(req.body, decodedToken);

    sendResponse(res, {
        success: true,
        message: "Add money successful.",
        data: transaction,
        statusCode: httpStatusCodes.OK
    });
});

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

// Agent to agent B2b
const agentToAgentB2b = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const decodedToken = req.user;

    const transaction = await TransactionServices.agentToAgentB2b(req.body, decodedToken);

    sendResponse(res, {
        success: true,
        message: "Your b2b transaction successful.",
        data: transaction,
        statusCode: httpStatusCodes.OK
    });
});

// Get All Transaction Data
const getAllTransactionData = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const { limit } = req.query;

    let dataLimit = 10

    if (limit) {
        dataLimit = Number(limit)
    }

    const transaction = await Transaction.find({})
        .populate("send", "name email role phone")
        .populate("to", "name email role phone").limit(dataLimit)

    const total = await Transaction.countDocuments();

    sendResponse(res, {
        success: true,
        message: "All Transaction Retrieved Successfully.",
        data: {
            total: {
                count: total
            }, transaction
        },
        statusCode: httpStatusCodes.OK
    });
});

// Get Single Transaction 
const getASingleTransaction = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const transaction = await Transaction.findById(req.params.id)
        .populate("send")
        .populate("to");

    if (!transaction) {
        throw new AppError(httpStatusCodes.NOT_FOUND, "No transaction found. Please try with right id.")
    }

    sendResponse(res, {
        success: true,
        message: "Transaction Retrieved Successfully.",
        data: transaction,
        statusCode: httpStatusCodes.OK
    });
});



export const TransactionController = {
    cashInTransfer,
    sendMoneyTransfer,
    userCashOutAgent,
    getAllTransactionData,
    getASingleTransaction,
    addMoneyToAgent,
    agentToAgentB2b
}