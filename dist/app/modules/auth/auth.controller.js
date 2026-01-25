"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const catchAsyncTryCatch_1 = require("../../utils/catchAsyncTryCatch");
const sendResponse_1 = require("../../utils/sendResponse");
const auth_services_1 = require("./auth.services");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const setTokenInCookie_1 = require("../../utils/setTokenInCookie");
const AppError_1 = require("../../utils/AppError");
const userTokens_1 = require("../../utils/userTokens");
// User login with email and password and cookie set
const AuthLogIn = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_services_1.AuthServices.AuthLogIn(req.body);
    (0, setTokenInCookie_1.setTokenInCookie)(res, { accessToken: result.accessToken, refreshToken: result.refreshToken });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "User logged in Successfully.",
        data: result,
        statusCode: http_status_codes_1.default.OK
    });
}));
// User login with email and password and cookie set
const resetUserPassword = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    yield auth_services_1.AuthServices.resetUserPasswordService(req.body, decodedToken);
    // setTokenInCookie(res, { accessToken: result.accessToken, refreshToken: result.refreshToken });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "User password reset successfully.",
        data: null,
        statusCode: http_status_codes_1.default.OK
    });
}));
// forgot password email send
const forgotUserPassword = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield auth_services_1.AuthServices.forgotUserPassword(email);
    // setTokenInCookie(res, { accessToken: result.accessToken, refreshToken: result.refreshToken });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Forgot Password Email Sent Successfully.",
        data: null,
        statusCode: http_status_codes_1.default.OK
    });
}));
// Get new access token from refresh token 
const getNewAccessTokenFromRefreshToken = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "No refresh token found.");
    }
    ;
    const tokenInfo = yield (0, userTokens_1.newAccessTokenFromRefreshToken)(refreshToken);
    (0, setTokenInCookie_1.setTokenInCookie)(res, { accessToken: tokenInfo });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Access Token find Successfully.",
        data: tokenInfo,
        statusCode: http_status_codes_1.default.OK
    });
}));
// Auth Logout function 
const AuthLogOut = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "User logged out Successfully.",
        data: null,
        statusCode: http_status_codes_1.default.OK
    });
}));
exports.AuthController = {
    AuthLogIn,
    AuthLogOut,
    getNewAccessTokenFromRefreshToken,
    resetUserPassword,
    forgotUserPassword
};
