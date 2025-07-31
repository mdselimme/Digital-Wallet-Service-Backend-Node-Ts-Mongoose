import { Request, Response } from "express";
import { catchAsyncTryCatchHandler } from "../../utils/catchAsyncTryCatch";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { UserService } from "./user.service";
import { JwtPayload } from "jsonwebtoken";



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

// Get All Users 
const getAllUsers = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const result = await UserService.getAllUsers();

    sendResponse(res, {
        success: true,
        message: "All User Retrieved Successfully.",
        data: result,
        statusCode: StatusCodes.OK
    });
})

// Get Me Users 
const getMeUser = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const decodedToken = req.user as JwtPayload;

    const result = await UserService.getMeUser(decodedToken.userId);

    sendResponse(res, {
        success: true,
        message: "My profile retrieved Successfully.",
        data: result,
        statusCode: StatusCodes.OK
    });
});

// Get Single User 
const getSingleUser = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const result = await UserService.getSingleUser(req.params.userId);

    sendResponse(res, {
        success: true,
        message: "Get User Successfully",
        data: result,
        statusCode: StatusCodes.OK
    });
});

// Update An User 
const updateAnUser = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const decodedToken = req.user;

    const result = await UserService.updateAnUser(req.params.id, req.body, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        message: "Update User Successfully",
        data: result,
        statusCode: StatusCodes.OK
    });
});

// Update An User Role
const updateAnUserRole = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const decodedToken = req.user;

    const result = await UserService.updateAnUserRole(req.params.id, req.body, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        message: "Update User Role Successfully",
        data: result,
        statusCode: StatusCodes.OK
    });
});

export const UserController = {
    createAnUser,
    getAllUsers,
    getMeUser,
    getSingleUser,
    updateAnUser,
    updateAnUserRole
};