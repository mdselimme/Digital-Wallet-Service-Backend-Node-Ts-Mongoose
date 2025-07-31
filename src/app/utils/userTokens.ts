import httpStatusCodes from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken";
import { envData } from "../config/envVariable";
import { isActive, IUserModel } from "../modules/users/user.interface";
import { User } from "../modules/users/user.model";
import { generateJwtToken, verifyJwtToken } from "./jwtTokenGenerate";
import { AppError } from "./AppError";



// Generate A new Access Token
export const createUserJwtToken = (user: Partial<IUserModel>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };

    const accessToken = generateJwtToken(jwtPayload, envData.JWT_ACCESS_SECRET, envData.JWT_ACCESS_EXPIRED);

    const refreshToken = generateJwtToken(jwtPayload, envData.JWT_REFRESH_SECRET, envData.JWT_REFRESH_EXPIRED);

    return {
        accessToken,
        refreshToken
    };
};

// Generate A new Access Token If access token expired 
export const newAccessTokenFromRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyJwtToken(refreshToken, envData.JWT_REFRESH_SECRET) as JwtPayload;

    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

    if (!isUserExist) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, "User  does not exist.")
    };

    if (isUserExist.isActive === isActive.Blocked || isUserExist.isActive === isActive.Deleted) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    };

    const jwtTokenPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    };

    const accessToken = generateJwtToken(jwtTokenPayload, envData.JWT_ACCESS_SECRET, envData.JWT_ACCESS_EXPIRED);

    return accessToken;
};