/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatusCodes from 'http-status-codes';
import { AppError } from "../../utils/AppError";
import { isActive, IUserModel } from "../users/user.interface";
import { User } from "../users/user.model";
import bcrypt from "bcrypt";
import { createUserJwtToken } from '../../utils/userTokens';
import { JwtPayload } from 'jsonwebtoken';
import { checkReceiverUser } from '../../utils/checkReceiverUser';
import { generateJwtToken } from '../../utils/jwtTokenGenerate';
import { sendEmail } from '../../utils/sendEmail';
import { envData } from '../../config/envVariable';

// User login with email and password and cookie set
const AuthLogIn = async (payload: Partial<IUserModel>) => {

    const { email, password } = payload;

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(httpStatusCodes.NOT_FOUND, "User Does Not Exist. Please register an account.");
    }
    // check receiver 
    checkReceiverUser(isUserExist as IUserModel)
    const comparePassword = await bcrypt.compare(password as string, isUserExist.password);

    if (!comparePassword) {
        throw new AppError(httpStatusCodes.NOT_FOUND, "Password does not match.");
    }

    const { accessToken, refreshToken } = createUserJwtToken(isUserExist);


    const { password: _, ...rest } = isUserExist.toObject();


    return {
        accessToken,
        refreshToken,
        user: rest
    }
};

// Reset User Password 
const resetUserPasswordService = async (payload: { oldPassword: string, newPassword: string }, decodedToken: JwtPayload) => {

    const { newPassword, oldPassword } = payload;

    const isUserExist = await User.findById(decodedToken.userId);

    const oldPasswordMatch = await bcrypt.compare(oldPassword, isUserExist?.password as string);

    if (!oldPasswordMatch) {
        throw new AppError(httpStatusCodes.NOT_ACCEPTABLE, "Old Password does not match.");
    }

    isUserExist!.password = await bcrypt.hash(newPassword, Number(envData.BCRYPT_HASH_ROUND));

    isUserExist?.save();

};

//FORGOT PASSWORD
const forgotUserPassword = async (email: string) => {
    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(httpStatusCodes.NOT_FOUND, "User Does Not Exist. Please register an account.");
    }
    // check receiver 
    checkReceiverUser(isUserExist as IUserModel)
    const createPasswordToken = generateJwtToken(
        { user: isUserExist._id },
        envData.JWT_ACCESS_SECRET,
        "5m"
    );

    const redirectUrl = `${envData.CLIENT_URL}/reset-password?user=${isUserExist._id}&token=${createPasswordToken}`;

    await sendEmail({
        to: email,
        subject: "Digital Wallet - Password Reset Request",
        templateName: "forgotPassword",
        templateData: {
            name: isUserExist.name || "User",
            redirectUrl: redirectUrl
        }
    });
}







export const AuthServices = {
    AuthLogIn,
    resetUserPasswordService,
    forgotUserPassword
}