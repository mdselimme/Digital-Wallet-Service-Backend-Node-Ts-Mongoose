import { Request, Response } from "express";
import { catchAsyncTryCatchHandler } from "../../utils/catchAsyncTryCatch";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";




const createAnUser = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {


    sendResponse(res, {
        success: true,
        message: "User Created Successfully.",
        data: null,
        statusCode: StatusCodes.CREATED
    })
});

export const UserController = { createAnUser };