/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatusCodes from 'http-status-codes';
import { AppError } from "../../utils/AppError";
import { isActive, IUserModel } from "../users/user.interface";
import { User } from "../users/user.model";
import bcrypt from "bcrypt";

const AuthLogIn = async (payload: Partial<IUserModel>) => {

    const { email, password } = payload;

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(httpStatusCodes.NOT_FOUND, "User not found.");
    }

    if (isUserExist.isActive === isActive.Blocked) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, "User is blocked. Contact support session.");
    }

    if (isUserExist.isActive === isActive.Deleted) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, "User is deleted.");
    };

    const comparePassword = await bcrypt.compare(password as string, isUserExist.password);

    if (!comparePassword) {
        throw new AppError(httpStatusCodes.NOT_FOUND, "Wrong password.");
    }

    const { password: _, ...rest } = isUserExist.toObject();

    return {
        user: rest
    }
};






export const AuthServices = { AuthLogIn }