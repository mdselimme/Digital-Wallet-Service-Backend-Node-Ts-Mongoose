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
/* const getAllUsers = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {



    const result = await UserService.getAllUsers(req.query);

    sendResponse(res, {
        success: true,
        message: "All User Retrieved Successfully.",
        data: result,
        statusCode: StatusCodes.OK
    });
}) */
const getAllUsers = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const { limit, sort, role, page } = req.query;

    const decodedToken = req.user;

    let dataLimit = 10

    if (limit) {
        dataLimit = Number(limit)
    }

    const currentPage = page ? Number(page) : 1;

    const result = await UserService.getAllUsers(dataLimit, sort as string, role as string, currentPage, decodedToken);

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

    const result = await UserService.updateAnUser(req.body, decodedToken as JwtPayload);

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

    const { email } = req.query;

    const result = await UserService.updateAnUserRole(email as string, req.body, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        message: "Update User Successfully",
        data: result,
        statusCode: StatusCodes.OK
    });
});

// Update An User Role
const updateAnUserStatus = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const decodedToken = req.user;

    const { email } = req.query;

    const result = await UserService.updateAnUserRole(email as string, req.body, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        message: "Update User Successfully",
        data: result,
        statusCode: StatusCodes.OK
    });
});

// Update An User Role
const updateAnUserIsActive = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const decodedToken = req.user;

    const { email } = req.query;

    const result = await UserService.updateAnUserIsActive(email as string, req.body, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        message: "Update User Successfully",
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
    updateAnUserRole,
    updateAnUserStatus,
    updateAnUserIsActive
};