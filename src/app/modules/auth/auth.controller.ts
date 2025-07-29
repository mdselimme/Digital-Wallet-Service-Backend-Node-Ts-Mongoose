import { Request, Response } from "express"
import { catchAsyncTryCatchHandler } from "../../utils/catchAsyncTryCatch"
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.services";
import httpStatusCodes from "http-status-codes";
import { setTokenInCookie } from "../../utils/setTokenInCookie";
import { AppError } from "../../utils/AppError";
import { newAccessTokenFromRefreshToken } from "../../utils/userTokens";



// User login with email and password and cookie set
const AuthLogIn = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const result = await AuthServices.AuthLogIn(req.body);

    setTokenInCookie(res, { accessToken: result.accessToken, refreshToken: result.refreshToken });

    sendResponse(res, {
        success: true,
        message: "User logged in Successfully.",
        data: result,
        statusCode: httpStatusCodes.OK
    });
});

// Get new access token from refresh token 
const getNewAccessTokenFromRefreshToken = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, "No refresh token found.");
    };

    const tokenInfo = await newAccessTokenFromRefreshToken(refreshToken);

    setTokenInCookie(res, { accessToken: tokenInfo });

    sendResponse(res, {
        success: true,
        message: "User logged out Successfully.",
        data: tokenInfo,
        statusCode: httpStatusCodes.OK
    });
})



// Auth Logout function 
const AuthLogOut = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        message: "User logged out Successfully.",
        data: null,
        statusCode: httpStatusCodes.OK
    });
})





export const AuthController = { AuthLogIn, AuthLogOut, getNewAccessTokenFromRefreshToken }