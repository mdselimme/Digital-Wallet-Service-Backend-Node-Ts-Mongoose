"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const envVariable_1 = require("../config/envVariable");
const AppError_1 = require("../utils/AppError");
const castErrorHandle_1 = require("../errorHelpers/castErrorHandle");
const duplicateErrorHandle_1 = require("../errorHelpers/duplicateErrorHandle");
const validationErrorHandle_1 = require("../errorHelpers/validationErrorHandle");
const zodValidationErrorHandle_1 = require("../errorHelpers/zodValidationErrorHandle");
const globalErrorHandler = (error, req, res, next) => {
    if (envVariable_1.envData.NODE_DEV === "development") {
        // eslint-disable-next-line no-console
        console.log(error);
    }
    ;
    let errorSource = [];
    let statusCode = 500;
    let message = `Something went wrong!! ${error.message}`;
    // Duplicate Key Error 
    if (error.code === 11000) {
        const simplifiedError = (0, duplicateErrorHandle_1.handlerDuplicateError)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Mongoose Cast Error 
    else if (error.name === "CastError") {
        const simplifiedError = (0, castErrorHandle_1.handleCastError)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Validation Error 
    else if (error.name === "ValidationError") {
        const simplifiedError = (0, validationErrorHandle_1.handleValidationError)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSource = simplifiedError.errorSources;
    }
    // Zod Validation Error 
    else if (error.name === "ZodError") {
        const simplifiedError = (0, zodValidationErrorHandle_1.handleZodValidationError)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSource = simplifiedError.errorSources;
    }
    else if (error instanceof AppError_1.AppError) {
        statusCode = error.statusCode;
        message = error.message;
    }
    else if (error instanceof Error) {
        statusCode = 500;
        message = error.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSource,
        error: envVariable_1.envData.NODE_DEV === "development" ? error : null,
        stack: envVariable_1.envData.NODE_DEV === "development" ? error.stack : null,
    });
};
exports.globalErrorHandler = globalErrorHandler;
