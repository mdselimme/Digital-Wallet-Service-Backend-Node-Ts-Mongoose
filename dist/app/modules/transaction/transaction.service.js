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
exports.TransactionServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = require("../../utils/AppError");
const user_model_1 = require("../users/user.model");
const user_interface_1 = require("../users/user.interface");
const bcrypt_1 = __importDefault(require("bcrypt"));
const transaction_model_1 = require("./transaction.model");
const transaction_interface_1 = require("./transaction.interface");
const wallet_model_1 = require("../wallet/wallet.model");
const checkReceiverUser_1 = require("../../utils/checkReceiverUser");
const mongoose_1 = __importDefault(require("mongoose"));
// Add Money Super Admin to Admin User Agent
const addMoneyToAll = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield wallet_model_1.Wallet.startSession();
    session.startTransaction();
    try {
        // payment data 
        const { receiverEmail, senderPassword, amount } = payload;
        // receiverUser 
        const receiverUser = yield user_model_1.User.findOne({ email: receiverEmail });
        // if receiver not found 
        if (!receiverUser) {
            throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Receiver User not found.");
        }
        ;
        // check receiver 
        (0, checkReceiverUser_1.checkReceiverUser)(receiverUser);
        // add money receive only other user 
        if (receiverUser.role === user_interface_1.IUserRole.Super_Admin) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `Your receiver account type is ${receiverUser.role}. You can't add money.`);
        }
        ;
        // who send the money 
        const sendingUser = yield user_model_1.User.findById(decodedToken.userId);
        // if sender not found 
        if (!sendingUser) {
            throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Sending User not found.");
        }
        ;
        // if sender and receiver same email
        if (sendingUser.email === payload.receiverEmail) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Same user! Can't transaction.");
        }
        // sender password check 
        const passwordCheck = yield bcrypt_1.default.compare(senderPassword, sendingUser.password);
        // if password don't match 
        if (!passwordCheck) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Wrong password! Try with right password.");
        }
        ;
        // sender wallet 
        const senderWallet = yield wallet_model_1.Wallet.findById(sendingUser.walletId);
        // if sender balance 0 or big 
        if (Number(senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) < amount) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance. Please add money.");
        }
        // transaction payload 
        const transactionPayload = {
            send: sendingUser._id,
            to: receiverUser._id,
            amount: amount,
            fee: transaction_interface_1.ITransFee.Free,
            commission: transaction_interface_1.ITransFee.Free,
            type: transaction_interface_1.IPaymentType.ADD_MONEY
        };
        // transaction create 
        const transaction = yield transaction_model_1.Transaction.create([transactionPayload], { session });
        // receiver wallet 
        const receiverWallet = yield wallet_model_1.Wallet.findById(receiverUser.walletId);
        // receiver new balance 
        const newReceiverBalance = Number(receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance) + Number(transaction[0].amount);
        // receiver wallet update 
        yield wallet_model_1.Wallet.findByIdAndUpdate(receiverUser.walletId, {
            balance: newReceiverBalance,
            $push: { "transaction": transaction[0]._id }
        }, { session });
        // new sender balance 
        const newSenderBalance = Number((senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) + transaction[0].commission) - Number(transaction[0].amount);
        // update sender wallet 
        yield wallet_model_1.Wallet.findByIdAndUpdate(sendingUser.walletId, {
            balance: newSenderBalance,
            $push: { "transaction": transaction[0]._id }
        }, { session });
        yield session.commitTransaction();
        session.endSession();
        return transaction;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// Cash in From Agent to User 
const cashInTransfer = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield wallet_model_1.Wallet.startSession();
    session.startTransaction();
    try {
        // payment data 
        const { receiverEmail, senderPassword, amount } = payload;
        // receiverUser 
        const receiverUser = yield user_model_1.User.findOne({ email: receiverEmail });
        // if receiver not found 
        if (!receiverUser) {
            throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Receiver User not found.");
        }
        ;
        (0, checkReceiverUser_1.checkReceiverUser)(receiverUser);
        // cash in receive only normal user 
        if (receiverUser.role !== user_interface_1.IUserRole.User) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `Your receiver account type is ${receiverUser.role}. Only user can cash in.`);
        }
        ;
        // who send the money 
        const sendingUser = yield user_model_1.User.findById(decodedToken.userId);
        // if sender not found 
        if (!sendingUser) {
            throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Sending User not found.");
        }
        ;
        // cash in can do only agent user 
        if (sendingUser.role !== user_interface_1.IUserRole.Agent) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `Your sender account type is ${sendingUser.role}. Only agent account can cash in.`);
        }
        ;
        // cash in receive only normal user 
        if (sendingUser.email === payload.receiverEmail) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `Same Account can't perform transaction.`);
        }
        ;
        // sender password check 
        const passwordCheck = yield bcrypt_1.default.compare(senderPassword, sendingUser.password);
        // if password don't match 
        if (!passwordCheck) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Wrong password! Try with right password.");
        }
        ;
        // sender wallet 
        const senderWallet = yield wallet_model_1.Wallet.findById(sendingUser.walletId);
        // if sender balance 0 or big 
        if (Number(senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) < amount) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance. Please add money.");
        }
        // transaction payload 
        const transactionPayload = {
            send: sendingUser._id,
            to: receiverUser._id,
            amount: amount,
            fee: transaction_interface_1.ITransFee.Free,
            commission: amount * (transaction_interface_1.ITransFee.Agent / 100),
            type: transaction_interface_1.IPaymentType.CASH_IN
        };
        // transaction create 
        const transaction = yield transaction_model_1.Transaction.create([transactionPayload], { session });
        // receiver wallet 
        const receiverWallet = yield wallet_model_1.Wallet.findById(receiverUser.walletId);
        // receiver new balance 
        const newReceiverBalance = Number(receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance) + Number(transaction[0].amount);
        // receiver wallet update 
        yield wallet_model_1.Wallet.findByIdAndUpdate(receiverUser.walletId, {
            balance: newReceiverBalance,
            $push: { "transaction": transaction[0]._id }
        }, { session });
        // new sender balance 
        const newSenderBalance = Number((senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) + transaction[0].commission) - Number(transaction[0].amount);
        // update sender wallet 
        yield wallet_model_1.Wallet.findByIdAndUpdate(sendingUser.walletId, {
            balance: newSenderBalance,
            $push: { "transaction": transaction[0]._id }
        }, { session });
        yield session.commitTransaction();
        session.endSession();
        return transaction;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// Send Money From User to User 
const sendMoneyTransfer = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield wallet_model_1.Wallet.startSession();
    session.startTransaction();
    try {
        // payment data 
        const { receiverEmail, senderPassword, amount } = payload;
        // receiverUser 
        const receiverUser = yield user_model_1.User.findOne({ email: receiverEmail });
        // if receiver not found 
        if (!receiverUser) {
            throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Receiver User not found.");
        }
        ;
        // check receiver 
        (0, checkReceiverUser_1.checkReceiverUser)(receiverUser);
        // cash in receive only normal user 
        if (receiverUser.role !== user_interface_1.IUserRole.User) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `Your receiver account type is ${receiverUser.role}. Only user can received money from user.`);
        }
        ;
        // who send the money 
        const sendingUser = yield user_model_1.User.findById(decodedToken.userId);
        // if sender not found 
        if (!sendingUser) {
            throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Sending User not found.");
        }
        ;
        // cash in can do only agent user 
        if (sendingUser.role !== user_interface_1.IUserRole.User) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `Your sender account type is ${sendingUser.role}. Only user can send money another user.`);
        }
        ;
        // if sender and receiver same email
        if (sendingUser.email === payload.receiverEmail) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Same user! Can't transaction.");
        }
        // sender password check 
        const passwordCheck = yield bcrypt_1.default.compare(senderPassword, sendingUser.password);
        // if password don't match 
        if (!passwordCheck) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Wrong password! Try with right password.");
        }
        ;
        // sender wallet 
        const senderWallet = yield wallet_model_1.Wallet.findById(sendingUser.walletId);
        // if sender balance 0 or big 
        if (Number(senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) < amount) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance. Please add money.");
        }
        // transaction payload 
        const transactionPayload = {
            send: sendingUser._id,
            to: receiverUser._id,
            amount: amount,
            fee: amount * (transaction_interface_1.ITransFee.User / 100),
            commission: transaction_interface_1.ITransFee.Free,
            type: transaction_interface_1.IPaymentType.SEND_MONEY
        };
        // transaction create 
        const transaction = yield transaction_model_1.Transaction.create([transactionPayload], { session });
        // receiver wallet 
        const receiverWallet = yield wallet_model_1.Wallet.findById(receiverUser.walletId);
        // receiver new balance 
        const newReceiverBalance = Number(receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance) + Number(transaction[0].amount);
        // receiver wallet update 
        yield wallet_model_1.Wallet.findByIdAndUpdate(receiverUser.walletId, {
            balance: newReceiverBalance,
            $push: { "transaction": transaction[0]._id }
        }, { session });
        // new sender balance 
        const newSenderBalance = Number(senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) - Number(transaction[0].amount + transaction[0].fee);
        // update sender wallet 
        yield wallet_model_1.Wallet.findByIdAndUpdate(sendingUser.walletId, {
            balance: newSenderBalance,
            $push: { "transaction": transaction[0]._id }
        }, { session });
        yield session.commitTransaction();
        session.endSession();
        return transaction;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// Cash Out User From Agent 
const userCashOutAgent = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield wallet_model_1.Wallet.startSession();
    session.startTransaction();
    try {
        // payment data 
        const { receiverEmail, senderPassword, amount } = payload;
        // receiverUser 
        const receiverUser = yield user_model_1.User.findOne({ email: receiverEmail });
        // if receiver not found 
        if (!receiverUser) {
            throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Receiver User not found.");
        }
        ;
        // check receiver 
        (0, checkReceiverUser_1.checkReceiverUser)(receiverUser);
        // cash in receive only normal user 
        if (receiverUser.role !== user_interface_1.IUserRole.Agent) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `Your Receiver account type is ${receiverUser.role}. Only agent account type can receive.`);
        }
        ;
        // who send the money 
        const sendingUser = yield user_model_1.User.findById(decodedToken.userId);
        // if sender not found 
        if (!sendingUser) {
            throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Sending User not found.");
        }
        ;
        // cash in can do only agent user 
        if (sendingUser.role !== user_interface_1.IUserRole.User) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `Your sender account type is ${sendingUser.role}. Only user account can cash out.`);
        }
        ;
        // if sender and receiver same email
        if (sendingUser.email === payload.receiverEmail) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Same user! Can't transaction.");
        }
        // sender password check 
        const passwordCheck = yield bcrypt_1.default.compare(senderPassword, sendingUser.password);
        // if password don't match 
        if (!passwordCheck) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Wrong password! Try with right password.");
        }
        ;
        // sender wallet 
        const senderWallet = yield wallet_model_1.Wallet.findById(sendingUser.walletId);
        // if sender balance 0 or big 
        if (Number(senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) < amount) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance. Please add money.");
        }
        // transaction payload 
        const transactionPayload = {
            send: sendingUser._id,
            to: receiverUser._id,
            amount: amount,
            fee: amount * (transaction_interface_1.ITransFee.CashOut / 100),
            commission: amount * (transaction_interface_1.ITransFee.Agent / 100),
            type: transaction_interface_1.IPaymentType.CASH_OUT
        };
        // transaction create 
        const transaction = yield transaction_model_1.Transaction.create([transactionPayload], { session });
        // receiver wallet 
        const receiverWallet = yield wallet_model_1.Wallet.findById(receiverUser.walletId);
        // receiver new balance 
        const newReceiverBalance = Number(receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance) + Number(transaction[0].amount) + Number(transaction[0].commission);
        // receiver wallet update 
        yield wallet_model_1.Wallet.findByIdAndUpdate(receiverUser.walletId, {
            balance: newReceiverBalance,
            $push: { "transaction": transaction[0]._id }
        }, { session });
        // new sender balance 
        const newSenderBalance = Number(senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) - Number(transaction[0].amount + transaction[0].fee);
        // update sender wallet 
        yield wallet_model_1.Wallet.findByIdAndUpdate(sendingUser.walletId, {
            balance: newSenderBalance,
            $push: { "transaction": transaction[0]._id }
        }, { session });
        yield session.commitTransaction();
        session.endSession();
        return transaction;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// Cash Out User From Agent 
const agentToAgentB2b = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield wallet_model_1.Wallet.startSession();
    session.startTransaction();
    try {
        // payment data 
        const { receiverEmail, senderPassword, amount } = payload;
        // receiverUser 
        const receiverUser = yield user_model_1.User.findOne({ email: receiverEmail });
        // if receiver not found 
        if (!receiverUser) {
            throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Receiver User not found.");
        }
        ;
        // check receiver 
        (0, checkReceiverUser_1.checkReceiverUser)(receiverUser);
        // cash in receive only normal user 
        if (receiverUser.role !== user_interface_1.IUserRole.Agent) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `Your Receiver account type is ${receiverUser.role}. Only agent account type can receive b2b.`);
        }
        ;
        // who send the money 
        const sendingUser = yield user_model_1.User.findById(decodedToken.userId);
        // if sender not found 
        if (!sendingUser) {
            throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Sending User not found.");
        }
        ;
        // cash in can do only agent user 
        if (sendingUser.role !== user_interface_1.IUserRole.Agent) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `Your sender account type is ${sendingUser.role}. Only agent account type can send b2b.`);
        }
        ;
        // if sender and receiver same email
        if (sendingUser.email === payload.receiverEmail) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Same user! Can't transaction.");
        }
        // sender password check 
        const passwordCheck = yield bcrypt_1.default.compare(senderPassword, sendingUser.password);
        // if password don't match 
        if (!passwordCheck) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Wrong password! Try with right password.");
        }
        ;
        // sender wallet 
        const senderWallet = yield wallet_model_1.Wallet.findById(sendingUser.walletId);
        // if sender balance 0 or big 
        if (Number(senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) < amount) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance. Please add money.");
        }
        // transaction payload 
        const transactionPayload = {
            send: sendingUser._id,
            to: receiverUser._id,
            amount: amount,
            fee: transaction_interface_1.ITransFee.Free,
            commission: transaction_interface_1.ITransFee.Free,
            type: transaction_interface_1.IPaymentType.B2B
        };
        // transaction create 
        const transaction = yield transaction_model_1.Transaction.create([transactionPayload], { session });
        // receiver wallet 
        const receiverWallet = yield wallet_model_1.Wallet.findById(receiverUser.walletId);
        // receiver new balance 
        const newReceiverBalance = Number(receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance) + Number(transaction[0].amount) + Number(transaction[0].commission);
        // receiver wallet update 
        yield wallet_model_1.Wallet.findByIdAndUpdate(receiverUser.walletId, {
            balance: newReceiverBalance,
            $push: { "transaction": transaction[0]._id }
        }, { session });
        // new sender balance 
        const newSenderBalance = Number(senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) - Number(transaction[0].amount + transaction[0].fee);
        // update sender wallet 
        yield wallet_model_1.Wallet.findByIdAndUpdate(sendingUser.walletId, {
            balance: newSenderBalance,
            $push: { "transaction": transaction[0]._id }
        }, { session });
        yield session.commitTransaction();
        session.endSession();
        return transaction;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// Get A Single Transaction 
const getASingleTransaction = (id, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role === user_interface_1.IUserRole.Agent || decodedToken.role === user_interface_1.IUserRole.User) {
        const user = yield user_model_1.User.findById(decodedToken.userId);
        if (!user) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Not a valid user");
        }
        const tranId = new mongoose_1.default.Types.ObjectId(id);
        const wallet = yield wallet_model_1.Wallet.findById(decodedToken.walletId);
        if (!wallet) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Not a valid transaction");
        }
        // check same user wallet transaction match 
        const isTransactionValid = wallet.transaction.some((trxId) => trxId.equals(tranId));
        if (!isTransactionValid) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "It's not your transaction.");
        }
    }
    const transaction = yield transaction_model_1.Transaction.findById(id)
        .populate("send", "name email phone role")
        .populate("to", "name email phone role");
    if (!transaction) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Transaction id is not valid.");
    }
    return transaction;
});
exports.TransactionServices = {
    cashInTransfer,
    sendMoneyTransfer,
    userCashOutAgent,
    addMoneyToAll,
    agentToAgentB2b,
    getASingleTransaction
};
