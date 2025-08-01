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
exports.WalletService = void 0;
const wallet_model_1 = require("./wallet.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = require("../../utils/AppError");
const getMySingleWallet = (walletId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.walletId !== walletId) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "You are not authorized user.");
    }
    const result = yield wallet_model_1.Wallet.findById(walletId).populate("transaction").lean();
    if (!result) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Wallet data not found.");
    }
    ;
    return result;
});
// Get all wallet data 
const getAllWalletData = (limit) => __awaiter(void 0, void 0, void 0, function* () {
    let dataLimit = 10;
    if (limit) {
        dataLimit = Number(limit);
    }
    const result = yield wallet_model_1.Wallet.find({}).populate("user", "name email role phone").limit(dataLimit);
    if (!result) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Wallet data not found.");
    }
    ;
    return result;
});
exports.WalletService = {
    getMySingleWallet,
    getAllWalletData
};
