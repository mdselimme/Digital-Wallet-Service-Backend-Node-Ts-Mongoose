import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/AppError";
import { IUserModel } from "./user.interface"
import { User } from "./user.model";
import bcrypt from "bcrypt";
import { envData } from "../../config/envVariable";
import { Wallet } from "../wallet/wallet.model";
import { IWallet } from "../wallet/wallet.interface";
import { Transaction } from "../transaction/transaction.model";
import { IPaymentType, ITransaction, ITransFee } from "../transaction/transaction.interface";


// Create An User 
const createAnUser = async (payload: Partial<IUserModel>) => {

    const session = await User.startSession();

    session.startTransaction();

    try {
        const { email, password } = payload;

        const isUserExist = await User.findOne({ email });

        if (isUserExist) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Email already exist.");
        }

        const hashedPassword = await bcrypt.hash(password as string, Number(envData.BCRYPT_HASH_ROUND));

        const userData = {
            ...payload,
            email,
            password: hashedPassword
        };

        const user = await User.create([userData], { session });

        const digitalWallet = await User.findOne({ email: envData.SUPER_ADMIN_EMAIL });

        if (!digitalWallet) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Server Response Problem");
        }

        const transactionPayload: ITransaction = {
            send: digitalWallet._id,
            to: user[0]._id,
            amount: 50,
            fee: ITransFee.Free,
            type: IPaymentType.BONUS
        };

        const transaction = await Transaction.create([transactionPayload], { session });


        const walletPayload: IWallet = {
            user: user[0]._id,
            balance: transaction[0].amount,
            transaction: [transaction[0]._id]
        };

        const wallet = await Wallet.create([walletPayload], { session });

        const updateUser = await User.findByIdAndUpdate(user[0]._id, { walletId: wallet[0]._id }, { session, new: true });

        await session.commitTransaction();

        session.endSession();

        return updateUser;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

// Get All Users Service 
const getAllUsers = async () => {

    const users = await User.find({}).select("-password");

    const userCount = await User.countDocuments();

    return {
        total: {
            count: userCount
        },
        users,
    }
};






export const UserService = { createAnUser, getAllUsers }