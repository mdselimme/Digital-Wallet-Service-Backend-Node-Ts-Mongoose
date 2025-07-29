import { envData } from "../config/envVariable";
import { IUserModel } from "../modules/users/user.interface";
import { generateJwtToken } from "./jwtTokenGenerate";




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
    }

};