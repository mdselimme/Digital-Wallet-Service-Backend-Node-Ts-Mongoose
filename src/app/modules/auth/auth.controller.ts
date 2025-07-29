import { Request, Response } from "express"
import { catchAsyncTryCatchHandler } from "../../utils/catchAsyncTryCatch"
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.services";
import httpStatusCodes from "http-status-codes";




const AuthLogIn = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const result = await AuthServices.AuthLogIn(req.body);

    sendResponse(res, {
        success: true,
        message: "User logged in Successfully.",
        data: result,
        statusCode: httpStatusCodes.OK
    });
})






export const AuthController = { AuthLogIn }