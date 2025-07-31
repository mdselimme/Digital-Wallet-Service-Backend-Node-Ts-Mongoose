import httpStatusCodes from 'http-status-codes';
import { AppError } from "../../utils/AppError";
import { User } from "../users/user.model";
import { JwtPayload } from 'jsonwebtoken';
import { IUserRole } from '../users/user.interface';
import bcrypt from 'bcrypt';
import { Transaction } from './transaction.model';
import { IPaymentType, ISendTransPayload, ITransaction, ITransFee } from './transaction.interface';
import { Wallet } from '../wallet/wallet.model';


// Add Money User to Agent 
const addMoneyToAgent = async (payload: ISendTransPayload, decodedToken: JwtPayload) => {

    const session = await Wallet.startSession();
    session.startTransaction()

    try {
        // payment data 
        const { receiverEmail, senderPassword, amount } = payload;
        // receiverUser 
        const receiverUser = await User.findOne({ email: receiverEmail });
        // if receiver not found 
        if (!receiverUser) {
            throw new AppError(httpStatusCodes.NOT_FOUND, "Receiver User not found.");
        };
        // add money receive only other user 
        if (receiverUser.role === IUserRole.Super_Admin) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, `Your receiver account type is ${receiverUser.role}.`);
        };
        // who send the money 
        const sendingUser = await User.findById(decodedToken.userId);
        // if sender not found 
        if (!sendingUser) {
            throw new AppError(httpStatusCodes.NOT_FOUND, "Sending User not found.");
        };
        // if sender and receiver same email
        if (sendingUser.email === payload.receiverEmail) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, "Same user! Can't transaction.");
        }
        // sender password check 
        const passwordCheck = await bcrypt.compare(senderPassword as string, sendingUser.password);
        // if password don't match 
        if (!passwordCheck) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, "Wrong password! Try with right password.");
        };
        // sender wallet 
        const senderWallet = await Wallet.findById(sendingUser.walletId);
        // if sender balance 0 or big 
        if (Number(senderWallet?.balance) < amount) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, "Insufficient balance. Please add money.");
        }
        // transaction payload 
        const transactionPayload: ITransaction = {
            send: sendingUser._id,
            to: receiverUser._id,
            amount: amount,
            fee: ITransFee.Free,
            commission: ITransFee.Free,
            type: IPaymentType.ADD_MONEY
        };
        // transaction create 
        const transaction = await Transaction.create([transactionPayload], { session });
        // receiver wallet 
        const receiverWallet = await Wallet.findById(receiverUser.walletId);
        // receiver new balance 
        const newReceiverBalance = Number(receiverWallet?.balance as number) + Number(transaction[0].amount);
        // receiver wallet update 
        await Wallet.findByIdAndUpdate(receiverUser.walletId, {
            balance: newReceiverBalance,
            $push: { "transaction": transaction[0]._id }
        }, { session });
        // new sender balance 
        const newSenderBalance = Number(senderWallet?.balance as number + transaction[0].commission) - Number(transaction[0].amount);
        // update sender wallet 
        await Wallet.findByIdAndUpdate(sendingUser.walletId, {
            balance: newSenderBalance,
            $push: { "transaction": transaction[0]._id }
        }, { session });
        await session.commitTransaction();
        session.endSession();
        return transaction;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};



// Cash in From Agent to User 
const cashInTransfer = async (payload: ISendTransPayload, decodedToken: JwtPayload) => {

    const session = await Wallet.startSession();
    session.startTransaction()

    try {
        // payment data 
        const { receiverEmail, senderPassword, amount } = payload;
        // receiverUser 
        const receiverUser = await User.findOne({ email: receiverEmail });
        // if receiver not found 
        if (!receiverUser) {
            throw new AppError(httpStatusCodes.NOT_FOUND, "Receiver User not found.");
        };
        // cash in receive only normal user 
        if (receiverUser && receiverUser.role !== IUserRole.User) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, `Your account type is ${receiverUser.role}. If you want to perform this you account have to do user.`);
        };
        // who send the money 
        const sendingUser = await User.findById(decodedToken.userId);
        // if sender not found 
        if (!sendingUser) {
            throw new AppError(httpStatusCodes.NOT_FOUND, "Sending User not found.");
        };
        // cash in can do only agent user 
        if (sendingUser && sendingUser.role !== IUserRole.Agent) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, `Your account type is ${sendingUser.role}. If you want to perform this you have to do agent.`);
        };
        // sender password check 
        const passwordCheck = await bcrypt.compare(senderPassword as string, sendingUser.password);
        // if password don't match 
        if (!passwordCheck) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, "Wrong password! Try with right password.");
        };
        // sender wallet 
        const senderWallet = await Wallet.findById(sendingUser.walletId);
        // if sender balance 0 or big 
        if (Number(senderWallet?.balance) < amount) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, "Insufficient balance. Please add money.");
        }
        // transaction payload 
        const transactionPayload: ITransaction = {
            send: sendingUser._id,
            to: receiverUser._id,
            amount: amount,
            fee: ITransFee.Free,
            commission: amount * (ITransFee.Agent / 100),
            type: IPaymentType.CASH_IN
        };
        // transaction create 
        const transaction = await Transaction.create([transactionPayload], { session });
        // receiver wallet 
        const receiverWallet = await Wallet.findById(receiverUser.walletId);
        // receiver new balance 
        const newReceiverBalance = Number(receiverWallet?.balance as number) + Number(transaction[0].amount);
        // receiver wallet update 
        await Wallet.findByIdAndUpdate(receiverUser.walletId, {
            balance: newReceiverBalance,
            $push: { "transaction": transaction[0]._id }
        }, { session });
        // new sender balance 
        const newSenderBalance = Number(senderWallet?.balance as number + transaction[0].commission) - Number(transaction[0].amount);
        // update sender wallet 
        await Wallet.findByIdAndUpdate(sendingUser.walletId, {
            balance: newSenderBalance,
            $push: { "transaction": transaction[0]._id }
        }, { session });
        await session.commitTransaction();
        session.endSession();
        return transaction;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

// Send Money From User to User 
const sendMoneyTransfer = async (payload: ISendTransPayload, decodedToken: JwtPayload) => {

    const session = await Wallet.startSession();
    session.startTransaction()

    try {
        // payment data 
        const { receiverEmail, senderPassword, amount } = payload;
        // receiverUser 
        const receiverUser = await User.findOne({ email: receiverEmail });
        // if receiver not found 
        if (!receiverUser) {
            throw new AppError(httpStatusCodes.NOT_FOUND, "Receiver User not found.");
        };
        // cash in receive only normal user 
        if (receiverUser && receiverUser.role !== IUserRole.User) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, `Your account type is ${receiverUser.role}. If you want to perform this you account have to need user.`);
        };
        // who send the money 
        const sendingUser = await User.findById(decodedToken.userId);
        // if sender not found 
        if (!sendingUser) {
            throw new AppError(httpStatusCodes.NOT_FOUND, "Sending User not found.");
        };
        // cash in can do only agent user 
        if (sendingUser && sendingUser.role !== IUserRole.User) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, `Your account type is ${sendingUser.role}. If you want to perform this you have to do agent.`);
        };
        // sender password check 
        const passwordCheck = await bcrypt.compare(senderPassword as string, sendingUser.password);
        // if password don't match 
        if (!passwordCheck) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, "Wrong password! Try with right password.");
        };
        // sender wallet 
        const senderWallet = await Wallet.findById(sendingUser.walletId);
        // if sender balance 0 or big 
        if (Number(senderWallet?.balance) < amount) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, "Insufficient balance. Please add money.");
        }
        // transaction payload 
        const transactionPayload: ITransaction = {
            send: sendingUser._id,
            to: receiverUser._id,
            amount: amount,
            fee: amount * (ITransFee.User / 100),
            commission: ITransFee.Free,
            type: IPaymentType.SEND_MONEY
        };
        // transaction create 
        const transaction = await Transaction.create([transactionPayload], { session });
        // receiver wallet 
        const receiverWallet = await Wallet.findById(receiverUser.walletId);
        // receiver new balance 
        const newReceiverBalance = Number(receiverWallet?.balance as number) + Number(transaction[0].amount);
        // receiver wallet update 
        await Wallet.findByIdAndUpdate(receiverUser.walletId, {
            balance: newReceiverBalance,
            $push: { "transaction": transaction[0]._id }
        }, { session });
        // new sender balance 
        const newSenderBalance = Number(senderWallet?.balance as number) - Number(transaction[0].amount + transaction[0].fee);
        // update sender wallet 
        await Wallet.findByIdAndUpdate(sendingUser.walletId, {
            balance: newSenderBalance,
            $push: { "transaction": transaction[0]._id }
        }, { session });
        await session.commitTransaction();
        session.endSession();
        return transaction;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

// Cash Out User From Agent 
const userCashOutAgent = async (payload: ISendTransPayload, decodedToken: JwtPayload) => {

    const session = await Wallet.startSession();
    session.startTransaction()

    try {
        // payment data 
        const { receiverEmail, senderPassword, amount } = payload;
        // receiverUser 
        const receiverUser = await User.findOne({ email: receiverEmail });
        // if receiver not found 
        if (!receiverUser) {
            throw new AppError(httpStatusCodes.NOT_FOUND, "Receiver User not found.");
        };
        // cash in receive only normal user 
        if (receiverUser && receiverUser.role !== IUserRole.Agent) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, `This account type is ${receiverUser.role}. If you want to perform this you account have to need agent.`);
        };
        // who send the money 
        const sendingUser = await User.findById(decodedToken.userId);
        // if sender not found 
        if (!sendingUser) {
            throw new AppError(httpStatusCodes.NOT_FOUND, "Sending User not found.");
        };
        // cash in can do only agent user 
        if (sendingUser && sendingUser.role !== IUserRole.User) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, `Your account type is ${sendingUser.role}. If you want to perform this you have to do agent.`);
        };
        // sender password check 
        const passwordCheck = await bcrypt.compare(senderPassword as string, sendingUser.password);
        // if password don't match 
        if (!passwordCheck) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, "Wrong password! Try with right password.");
        };
        // sender wallet 
        const senderWallet = await Wallet.findById(sendingUser.walletId);
        // if sender balance 0 or big 
        if (Number(senderWallet?.balance) < amount) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, "Insufficient balance. Please add money.");
        }
        // transaction payload 
        const transactionPayload: ITransaction = {
            send: sendingUser._id,
            to: receiverUser._id,
            amount: amount,
            fee: amount * (ITransFee.CashOut / 100),
            commission: amount * (ITransFee.Agent / 100),
            type: IPaymentType.CASH_OUT
        };
        // transaction create 
        const transaction = await Transaction.create([transactionPayload], { session });
        // receiver wallet 
        const receiverWallet = await Wallet.findById(receiverUser.walletId);
        // receiver new balance 
        const newReceiverBalance = Number(receiverWallet?.balance as number) + Number(transaction[0].amount) + Number(transaction[0].commission);
        // receiver wallet update 
        await Wallet.findByIdAndUpdate(receiverUser.walletId, {
            balance: newReceiverBalance,
            $push: { "transaction": transaction[0]._id }
        }, { session });
        // new sender balance 
        const newSenderBalance = Number(senderWallet?.balance as number) - Number(transaction[0].amount + transaction[0].fee);
        // update sender wallet 
        await Wallet.findByIdAndUpdate(sendingUser.walletId, {
            balance: newSenderBalance,
            $push: { "transaction": transaction[0]._id }
        }, { session });
        await session.commitTransaction();
        session.endSession();
        return transaction;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};




export const TransactionServices = {
    cashInTransfer,
    sendMoneyTransfer,
    userCashOutAgent,
    addMoneyToAgent
}