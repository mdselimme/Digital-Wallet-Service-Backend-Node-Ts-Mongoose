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
exports.seedSuperAdmin = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
/* eslint-disable no-console */
const envVariable_1 = require("../config/envVariable");
const user_interface_1 = require("../modules/users/user.interface");
const user_model_1 = require("../modules/users/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const wallet_model_1 = require("../modules/wallet/wallet.model");
const transaction_interface_1 = require("../modules/transaction/transaction.interface");
const AppError_1 = require("./AppError");
const transaction_model_1 = require("../modules/transaction/transaction.model");
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const isSuperAdminExist = yield user_model_1.User.findOne({ email: envVariable_1.envData.SUPER_ADMIN_EMAIL });
        if (isSuperAdminExist) {
            console.log("Super admin Already Exist.");
            return;
        }
        ;
        console.log("Trying to create super admin.");
        const hashPassword = yield bcrypt_1.default.hash(envVariable_1.envData.SUPER_ADMIN_PASS, Number(envVariable_1.envData.BCRYPT_HASH_ROUND));
        const payload = {
            name: "Digital Wallet",
            role: user_interface_1.IUserRole.Super_Admin,
            email: envVariable_1.envData.SUPER_ADMIN_EMAIL,
            password: hashPassword,
            phone: envVariable_1.envData.SUPER_ADMIN_PHONE,
            isVerified: true,
            userStatus: user_interface_1.IStatus.Approve
        };
        const user = yield user_model_1.User.create(payload);
        const digitalWallet = yield user_model_1.User.findOne({ email: envVariable_1.envData.SUPER_ADMIN_EMAIL });
        if (!digitalWallet) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Server Response Problem");
        }
        const transactionPayload = {
            send: digitalWallet._id,
            to: user._id,
            amount: 100000,
            fee: transaction_interface_1.ITransFee.Free,
            commission: transaction_interface_1.ITransFee.Free,
            type: transaction_interface_1.IPaymentType.BONUS
        };
        const transaction = yield transaction_model_1.Transaction.create([transactionPayload], { session });
        const walletPayload = {
            user: user._id,
            balance: transaction[0].amount,
            transaction: [transaction[0]._id]
        };
        const wallet = yield wallet_model_1.Wallet.create([walletPayload], { session });
        yield user_model_1.User.findByIdAndUpdate(user._id, { walletId: wallet[0]._id }, { session, new: true }).select("-password");
        yield session.commitTransaction();
        session.endSession();
        console.log("Super admin created.");
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            yield session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
