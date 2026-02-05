/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envData } from "../config/envVariable";
import { AppError } from "../utils/AppError";
import { IErrorResponse } from "../interfaces/error.types";
import { handleCastError } from "../errorHelpers/castErrorHandle";
import { handlerDuplicateError } from "../errorHelpers/duplicateErrorHandle";
import { handleValidationError } from "../errorHelpers/validationErrorHandle";
import { handleZodValidationError } from "../errorHelpers/zodValidationErrorHandle";




export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {

    if (envData.NODE_DEV === "development") {
        // eslint-disable-next-line no-console
        console.log(error);
    };
    let errorSource: IErrorResponse[] = [];
    let statusCode = 500;
    let message = `Something went wrong!! ${error.message}`;

    // Duplicate Key Error 
    if (error.code === 11000) {
        const simplifiedError = handlerDuplicateError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Mongoose Cast Error 
    else if (error.name === "CastError") {
        const simplifiedError = handleCastError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Validation Error 
    else if (error.name === "ValidationError") {
        const simplifiedError = handleValidationError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSource = simplifiedError.errorSources as IErrorResponse[];
    }
    // Zod Validation Error 
    else if (error.name === "ZodError") {
        const simplifiedError = handleZodValidationError(error);
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSource = simplifiedError.errorSources as IErrorResponse[];
    }
    else if (error instanceof AppError) {
        statusCode = error.statusCode
        message = error.message
    }
    else if (error instanceof Error) {
        statusCode = 500
        message = error.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSource,
        error: envData.NODE_DEV === "development" ? error : null,
        stack: envData.NODE_DEV === "development" ? error.stack : null,
    })
};