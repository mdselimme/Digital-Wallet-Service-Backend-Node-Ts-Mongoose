/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";




type AsyncFuncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const catchAsyncTryCatchHandler = (func: AsyncFuncHandler) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(func(req, res, next))
            .catch((err: any) => {
                next(err);
            });
    };