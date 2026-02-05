import { rateLimit } from "express-rate-limit";
import { envData } from "./envVariable";
import { Request, Response } from "express";


//auth rate limit
export const authRateLimit = rateLimit({
    windowMs: Number(envData.RATE_LIMIT.RATE_AUTH_WINDOW_MS),
    max: Number(envData.RATE_LIMIT.RATE_AUTH_LIMIT),
    message: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            message: "Too many requests from this IP, please try 5 minutes again later.",
        });
    },
});

//api rate limit
export const apiRateLimit = rateLimit({
    windowMs: Number(envData.RATE_LIMIT.RATE_API_WINDOW_MS),
    max: Number(envData.RATE_LIMIT.RATE_API_LIMIT),
    message: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            message: "Too many requests from this IP, please try 15 minutes again later.",
        });
    },
});
