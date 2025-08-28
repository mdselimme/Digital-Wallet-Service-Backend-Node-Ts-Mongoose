"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTokenInCookie = void 0;
const envVariable_1 = require("../config/envVariable");
const setTokenInCookie = (res, token) => {
    if (token.accessToken) {
        res.cookie("accessToken", token.accessToken, {
            httpOnly: true,
            secure: envVariable_1.envData.NODE_DEV === "production",
            sameSite: "none",
            maxAge: Number(envVariable_1.envData.COOKIE_EXPIRES_ACCESS_TOKEN)
        });
    }
    if (token.refreshToken) {
        res.cookie("refreshToken", token.refreshToken, {
            httpOnly: true,
            secure: envVariable_1.envData.NODE_DEV === "production",
            sameSite: "none",
            maxAge: Number(envVariable_1.envData.COOKIE_EXPIRES_REFRESH_TOKEN)
        });
    }
};
exports.setTokenInCookie = setTokenInCookie;
