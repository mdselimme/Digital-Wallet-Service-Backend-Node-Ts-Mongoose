/* eslint-disable @typescript-eslint/no-explicit-any */
import { IErrorResponse, IGenericErrorResponse } from "../interfaces/error.types";



export const handleZodValidationError = (err: any): IGenericErrorResponse => {
    const errorSources: IErrorResponse[] = [];
    err.issues.forEach((issue: any) => {
        errorSources.push({
            path: issue.path[issue.path.length - 1],
            message: issue.message
        })
    });
    return {
        statusCode: 400,
        message: "Zod Validation Error.",
        errorSources
    }
}