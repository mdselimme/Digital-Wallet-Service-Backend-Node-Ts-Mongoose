/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatusCodes from 'http-status-codes';
import { Request, Response } from "express";
import { catchAsyncTryCatchHandler } from "../../utils/catchAsyncTryCatch"
import { sendResponse } from "../../utils/sendResponse";
import { TransactionServices } from './transaction.service';
import { Transaction } from './transaction.model';




// Add Money Super Admin to Other
const addMoneyToAll = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const decodedToken = req.user;

    const transaction = await TransactionServices.addMoneyToAll(req.body, decodedToken);

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

    const { limit, sort, page, tranType, startDate, endDate } = req.query;

    const tranLimit = limit ? Number(limit) : 10;
    const currentPage = page ? Number(page) : 1;

    let sortTran: 1 | -1 = -1;
    const filters: any = {};

    if (startDate || endDate) {
        filters.createdAt = {};
        if (startDate) {
            filters.createdAt.$gte = new Date(startDate as string);
        }
        if (endDate) {
            filters.createdAt.$lte = new Date(endDate as string);
        }
    }

    if (tranType) {
        filters.type = tranType;
    }

    if (sort === "asc") {
        sortTran = 1;
    }

    const skip = (currentPage - 1) * tranLimit;

    const transaction = await Transaction.find(filters)
        .populate("send", "name email role phone")
        .populate("to", "name email role phone")
        .limit(tranLimit)
        .skip(skip)
        .sort({ createdAt: sortTran });

    const total = await Transaction.countDocuments(filters);

    sendResponse(res, {
        success: true,
        message: "All Transaction Retrieved Successfully.",
        data: {
            meta: {
                total,
                sort,
                page: currentPage,
                limit: tranLimit,
                totalPages: Math.ceil(total / tranLimit)
            },
            transaction
        },
        statusCode: httpStatusCodes.OK
    });
});

// Get Single Transaction 
const getASingleTransaction = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const decodedToken = req.user;


    const transaction = await TransactionServices.getASingleTransaction(req.params.id, decodedToken);


    sendResponse(res, {
        success: true,
        message: "Transaction Retrieved Successfully.",
        data: transaction,
        statusCode: httpStatusCodes.OK
    });
});

// Get My Transaction 
const getMyTransaction = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const decodedToken = req.user;

    const { limit, sort, page, startDate, endDate, tranType } = req.query;

    const tranLimit = limit ? Number(limit) : 10;
    const currentPage = page ? Number(page) : 1;
    const sortTran = sort ? (sort as string) : "desc";


    const transaction = await TransactionServices.getMyTransaction(
        tranLimit,
        currentPage,
        sortTran,
        decodedToken,
        startDate as string,
        endDate as string, tranType as string);

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
    addMoneyToAll,
    agentToAgentB2b,
    getMyTransaction
}