import { Request, Response } from "express";
import { catchAsyncTryCatchHandler } from "../../utils/catchAsyncTryCatch";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { UserService } from "./user.service";



// Create An User 
const createAnUser = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const result = await UserService.createAnUser(req.body);

    sendResponse(res, {
        success: true,
        message: "User Created Successfully.",
        data: result,
        statusCode: StatusCodes.CREATED
    });
});

export const UserController = { createAnUser };