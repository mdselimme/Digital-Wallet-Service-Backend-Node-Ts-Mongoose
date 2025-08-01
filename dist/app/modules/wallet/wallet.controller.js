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
exports.WalletController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsyncTryCatch_1 = require("../../utils/catchAsyncTryCatch");
const sendResponse_1 = require("../../utils/sendResponse");
const wallet_service_1 = require("./wallet.service");
// Get Single Wallet data 
const getMySingleWallet = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield wallet_service_1.WalletService.getMySingleWallet(req.params.id, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Wallet retrieved successfully.",
        data: result,
        statusCode: http_status_codes_1.default.OK
    });
}));
// Get All Wallet Data For admin 
const getAllWalletData = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit } = req.query;
    const result = yield wallet_service_1.WalletService.getAllWalletData(Number(limit));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "All Wallet retrieved successfully.",
        data: result,
        statusCode: http_status_codes_1.default.OK
    });
}));
exports.WalletController = {
    getMySingleWallet,
    getAllWalletData
};
