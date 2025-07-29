import { Response } from "express";


interface ISendResponse<T> {
    statusCode: number,
    success: boolean,
    message: string,
    data: T,
}


export const sendResponse = <T>(res: Response, data: ISendResponse<T>) => {
    res.status(data.statusCode).json({
        message: data.message,
        statusCode: data.statusCode,
        success: data.success,
        data: data.data
    })
};