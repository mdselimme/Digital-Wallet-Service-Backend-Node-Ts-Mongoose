import httpStatusCodes from 'http-status-codes';
import { isActive, IStatus, IUserModel } from "../modules/users/user.interface";
import { AppError } from "./AppError";





export const checkReceiverUser = (receiverUser: Partial<IUserModel>) => {
    // if receiver not approve 
    if (receiverUser.userStatus !== IStatus.Approve) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, `Account status is ${receiverUser.userStatus}. Please contact our support.`);
    };
    // if receiver not verified 
    if (!receiverUser.isVerified) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, `Account status is not verified.`);
    };
    // if receiver not active 
    if (receiverUser.isActive !== isActive.Active) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, `Account status is ${receiverUser.isActive}. Please contact our support.`);
    };
};