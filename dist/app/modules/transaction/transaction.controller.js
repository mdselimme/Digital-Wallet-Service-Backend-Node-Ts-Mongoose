"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsyncTryCatch_1 = require("../../utils/catchAsyncTryCatch");
const sendResponse_1 = require("../../utils/sendResponse");
const transaction_service_1 = require("./transaction.service");
const transaction_model_1 = require("./transaction.model");
// Add Money Super Admin to Other
const addMoneyToAll = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const transaction = yield transaction_service_1.TransactionServices.addMoneyToAll(req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Add money successful.",
        data: transaction,
        statusCode: http_status_codes_1.default.OK
    });
}));
//Cash In Agent to User
const cashInTransfer = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const transaction = yield transaction_service_1.TransactionServices.cashInTransfer(req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Cash In Successful.",
        data: transaction,
        statusCode: http_status_codes_1.default.OK
    });
}));
// Send Money User to User 
const sendMoneyTransfer = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const transaction = yield transaction_service_1.TransactionServices.sendMoneyTransfer(req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Send Money Successful.",
        data: transaction,
        statusCode: http_status_codes_1.default.OK
    });
}));
// User Cash Out 
const userCashOutAgent = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const transaction = yield transaction_service_1.TransactionServices.userCashOutAgent(req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Cash Out Successful.",
        data: transaction,
        statusCode: http_status_codes_1.default.OK
    });
}));
// Agent to agent B2b
const agentToAgentB2b = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const transaction = yield transaction_service_1.TransactionServices.agentToAgentB2b(req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Your b2b transaction successful.",
        data: transaction,
        statusCode: http_status_codes_1.default.OK
    });
}));
// Get All Transaction Data
const getAllTransactionData = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, sort } = req.query;
    let dataLimit = 10;
    let sortTran = -1;
    if (limit) {
        dataLimit = Number(limit);
    }
    if (sort === "desc") {
        sortTran = -1;
    }
    else {
        sortTran = 1;
    }
    const transaction = yield transaction_model_1.Transaction.find({})
        .populate("send", "name email role phone")
        .populate("to", "name email role phone")
        .limit(dataLimit)
        .sort({ createdAt: sortTran });
    const total = yield transaction_model_1.Transaction.countDocuments();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "All Transaction Retrieved Successfully.",
        data: {
            total: {
                count: total
            },
            transaction
        },
        statusCode: http_status_codes_1.default.OK
    });
}));
// Get Single Transaction 
const getASingleTransaction = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const transaction = yield transaction_service_1.TransactionServices.getASingleTransaction(req.params.id, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Transaction Retrieved Successfully.",
        data: transaction,
        statusCode: http_status_codes_1.default.OK
    });
}));
// Get My Transaction 
const getMyTransaction = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const { limit, sort } = req.query;
    let tranLimit = 10;
    let sortTran = "asc";
    if (limit) {
        tranLimit = Number(limit);
    }
    if (sort) {
        sortTran = sort;
    }
    const transaction = yield transaction_service_1.TransactionServices.getMyTransaction(tranLimit, sortTran, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Transaction Retrieved Successfully.",
        data: transaction,
        statusCode: http_status_codes_1.default.OK
    });
}));
exports.TransactionController = {
    cashInTransfer,
    sendMoneyTransfer,
    userCashOutAgent,
    getAllTransactionData,
    getASingleTransaction,
    addMoneyToAll,
    agentToAgentB2b,
    getMyTransaction
};
