import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/AppError";
import { IUserModel } from "./user.interface"
import { User } from "./user.model";
import bcrypt from "bcrypt";
import { envData } from "../../config/envVariable";
import { Wallet } from "../wallet/wallet.model";
import { IWallet } from "../wallet/wallet.interface";


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


        // const walletPayload: IWallet = {
        //     user: user[0]._id,
        //     balance: 50,
        //     transaction:
        // }

        // const wallet = await Wallet.create()

        return user;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }

};








export const UserService = { createAnUser }