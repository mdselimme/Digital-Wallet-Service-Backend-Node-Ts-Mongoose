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
exports.checkAuthenticationUser = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = require("../utils/AppError");
const envVariable_1 = require("../config/envVariable");
const jwtTokenGenerate_1 = require("../utils/jwtTokenGenerate");
const user_model_1 = require("../modules/users/user.model");
const user_interface_1 = require("../modules/users/user.interface");
const checkAuthenticationUser = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.headers.authorization || req.cookies.accessToken;
        // if access token not found 
        if (!accessToken) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_GATEWAY, "No token found! Please give token.");
        }
        // verify access token 
        const verifiedToken = (0, jwtTokenGenerate_1.verifyJwtToken)(accessToken, envVariable_1.envData.JWT_ACCESS_SECRET);
        // user find by email 
        const isUserExist = yield user_model_1.User.findOne({ email: verifiedToken.email });
        // If user not found 
        if (!isUserExist) {
            throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "User does not found. Token is not valid.");
        }
        ;
        // if user delete or blocked 
        if (isUserExist.isActive === user_interface_1.isActive.Blocked || isUserExist.isActive === user_interface_1.isActive.Deleted) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `User is ${isUserExist.isActive}. Contact our support session.`);
        }
        ;
        // if user delete or blocked 
        if (isUserExist.userStatus === user_interface_1.IStatus.Pending || isUserExist.userStatus === user_interface_1.IStatus.Suspend) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `User is ${isUserExist.isActive}. Contact our support session.`);
        }
        ;
        // if user is not verified 
        if (!isUserExist.isVerified) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `User is not verified.`);
        }
        ;
        // verify auth roles 
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "You are not authorized for this route.");
        }
        ;
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkAuthenticationUser = checkAuthenticationUser;
