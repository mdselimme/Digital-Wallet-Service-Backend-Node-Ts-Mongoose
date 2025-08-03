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
const user_interface_1 = require("../users/user.interface");
const transaction_model_1 = require("../transaction/transaction.model");
const transaction_interface_1 = require("../transaction/transaction.interface");
const user_model_1 = require("../users/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
// add money to super admin wallet id 
const addMoneyToSuperAdminWallet = (amount, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (amount <= 0) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Amount must be greater than 0.");
    }
    if (decodedToken.role !== user_interface_1.IUserRole.Super_Admin) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "You are not authorized for this route.");
    }
    const wallet = yield wallet_model_1.Wallet.findById(decodedToken.walletId);
    if (!wallet) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "No wallet found.");
    }
    // transaction payload 
    const transactionPayload = {
        send: decodedToken.userId,
        to: decodedToken.userId,
        amount: amount,
        fee: transaction_interface_1.ITransFee.Free,
        commission: transaction_interface_1.ITransFee.Free,
        type: transaction_interface_1.IPaymentType.ADD_MONEY
    };
    const transaction = yield transaction_model_1.Transaction.create(transactionPayload);
    const newWalletBalance = Number(wallet.balance) + Number(transaction.amount);
    yield wallet_model_1.Wallet.findByIdAndUpdate(decodedToken.walletId, {
        balance: newWalletBalance,
        $push: { "transaction": transaction._id }
    });
    return transaction;
});
// Get single wallet 
const getMySingleWallet = (walletId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (decodedToken.role === user_interface_1.IUserRole.Agent || decodedToken.role === user_interface_1.IUserRole.User) {
        const user = yield user_model_1.User.findById(decodedToken.userId);
        if (!user) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Not a valid user");
        }
        const walId = new mongoose_1.default.Types.ObjectId(walletId);
        const wallet = yield wallet_model_1.Wallet.findById(decodedToken.walletId);
        if (!wallet) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Not a valid wallet.");
        }
        // check same user wallet transaction match 
        if (!((_a = user.walletId) === null || _a === void 0 ? void 0 : _a.equals(walId)) && !wallet._id.equals(walId)) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "It's not your wallet.");
        }
    }
    const result = yield wallet_model_1.Wallet.findById(walletId)
        .populate("transaction").lean();
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
    getAllWalletData,
    addMoneyToSuperAdminWallet
};
