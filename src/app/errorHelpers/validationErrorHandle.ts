/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { IErrorResponse, IGenericErrorResponse } from "../interfaces/error.types";



export const handleValidationError = (err: mongoose.Error.ValidationError): IGenericErrorResponse => {

    const errorSources: IErrorResponse[] = [];

    const errors = Object.values(err.errors);

    errors.forEach((errObj: any) => errorSources.push({
        path: errObj.path,
        message: errObj.message
    }));
    return {
        statusCode: 400,
        message: "Validation Error.",
        errorSources
    }
};