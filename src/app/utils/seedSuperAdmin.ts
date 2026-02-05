import httpStatusCodes from 'http-status-codes';
/* eslint-disable no-console */
import { envData } from "../config/envVariable"
import { IStatus, IUserModel, IUserRole } from "../modules/users/user.interface";
import { User } from "../modules/users/user.model"
import bcrypt from "bcrypt";
import { Wallet } from "../modules/wallet/wallet.model";
import { IWallet } from "../modules/wallet/wallet.interface";
import { IPaymentType, ITransaction, ITransFee } from "../modules/transaction/transaction.interface";
import { AppError } from "./AppError";
import { Transaction } from '../modules/transaction/transaction.model';



export const seedSuperAdmin = async () => {

    const session = await User.startSession();

    session.startTransaction();

    try {
        const isSuperAdminExist = await User.findOne({ email: envData.SUPER_ADMIN_EMAIL });
        if (isSuperAdminExist) {
            console.log("Super admin Already Exist.");
            return;
        };

        console.log("Trying to create super admin.");

        const hashPassword = await bcrypt.hash(envData.SUPER_ADMIN_PASS, Number(envData.BCRYPT_HASH_ROUND));

        const payload: IUserModel = {
            name: "Digital Wallet",
            role: IUserRole.Super_Admin,
            email: envData.SUPER_ADMIN_EMAIL,
            password: hashPassword,
            phone: envData.SUPER_ADMIN_PHONE,
            isVerified: true,
            userStatus: IStatus.Approve
        };

        const user = await User.create(payload);


        const digitalWallet = await User.findOne({ email: envData.SUPER_ADMIN_EMAIL });

        if (!digitalWallet) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, "Server Response Problem");
        }

        const transactionPayload: ITransaction = {
            send: digitalWallet._id,
            to: user._id,
            amount: 100000,
            successful: true,
            fee: ITransFee.Free,
            commission: ITransFee.Free,
            type: IPaymentType.BONUS
        };

        const transaction = await Transaction.create([transactionPayload], { session });


        const walletPayload: IWallet = {
            user: user._id,
            balance: transaction[0].amount,
            transaction: [transaction[0]._id]
        };

        const wallet = await Wallet.create([walletPayload], { session });

        await User.findByIdAndUpdate(user._id, { walletId: wallet[0]._id }, { session, new: true }).select("-password");

        await session.commitTransaction();

        session.endSession();
        console.log("Super admin created.")

    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message)
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

}