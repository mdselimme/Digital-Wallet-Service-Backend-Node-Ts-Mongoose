import httpStatusCodes from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/AppError";
import { envData } from '../config/envVariable';
import { JwtPayload } from 'jsonwebtoken';
import { verifyJwtToken } from '../utils/jwtTokenGenerate';
import { User } from '../modules/users/user.model';
import { isActive, IStatus } from '../modules/users/user.interface';




export const checkAuthenticationUser = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;
        // if access token not found 
        if (!accessToken) {
            throw new AppError(httpStatusCodes.BAD_GATEWAY, "No token found! Please give token.");
        }
        // verify access token 
        const verifiedToken = verifyJwtToken(accessToken, envData.JWT_ACCESS_SECRET) as JwtPayload;
        // user find by email 
        const isUserExist = await User.findOne({ email: verifiedToken.email });
        // If user not found 
        if (!isUserExist) {
            throw new AppError(httpStatusCodes.NOT_FOUND, "User does not found.");
        };
        // if user delete or blocked 
        if (isUserExist.isActive === isActive.Blocked || isUserExist.isActive === isActive.Deleted) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, `User is ${isUserExist.isActive}. Contact our support session.`);
        };
        // if user delete or blocked 
        if (isUserExist.userStatus === IStatus.Pending || isUserExist.userStatus === IStatus.Suspend) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, `User is ${isUserExist.isActive}. Contact our support session.`);
        };
        // if user is not verified 
        if (!isUserExist.isVerified) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, `User is not verified.`);
        };
        // verify auth roles 
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(httpStatusCodes.BAD_REQUEST, "You are not authorized for this route.");
        };

        req.user = verifiedToken;

        next();

    } catch (error) {
        next(error)
    }

}