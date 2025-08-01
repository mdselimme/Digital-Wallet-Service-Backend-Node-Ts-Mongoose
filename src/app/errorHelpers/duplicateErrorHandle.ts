/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGenericErrorResponse } from "../interfaces/error.types";




export const handlerDuplicateError = (err: any): IGenericErrorResponse => {
    const matchedArray = err.message.match(/"([^"]*)"/);
    return {
        statusCode: 400,
        message: `${matchedArray[1]} already exist.`
    }
}
