/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envData } from "../config/envVariable";
import { AppError } from "../utils/AppError";




export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {

    if (envData.NODE_DEV === "development") {
        console.log(error);
    };
    let statusCode = 500;
    let message = `Something went wrong!! ${error.message}`;

    if (error instanceof AppError) {
        statusCode = error.statusCode
        message = error.message
    }
    if (error instanceof Error) {
        statusCode = 500
        message = error.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        error: envData.NODE_DEV === "development" ? error : null,
        stack: envData.NODE_DEV === "development" ? error.stack : null,
    })
};