import { Response } from "express";
import { envData } from "../config/envVariable";

interface IToken {
    accessToken?: string,
    refreshToken?: string,
}


export const setTokenInCookie = (res: Response, token: IToken) => {
    if (token.accessToken) {
        res.cookie("accessToken", token.accessToken, {
            httpOnly: true,
            secure: envData.NODE_DEV === "production",
            sameSite: "none"
        })
    }
    if (token.refreshToken) {
        res.cookie("refreshToken", token.refreshToken, {
            httpOnly: true,
            secure: envData.NODE_DEV === "production",
            sameSite: "none"
        })
    }
};