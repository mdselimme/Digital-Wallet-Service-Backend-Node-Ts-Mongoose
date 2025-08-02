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
exports.newAccessTokenFromRefreshToken = exports.createUserJwtToken = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const envVariable_1 = require("../config/envVariable");
const user_interface_1 = require("../modules/users/user.interface");
const user_model_1 = require("../modules/users/user.model");
const jwtTokenGenerate_1 = require("./jwtTokenGenerate");
const AppError_1 = require("./AppError");
// Generate A new Access Token
const createUserJwtToken = (user) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
        walletId: user.walletId
    };
    const accessToken = (0, jwtTokenGenerate_1.generateJwtToken)(jwtPayload, envVariable_1.envData.JWT_ACCESS_SECRET, envVariable_1.envData.JWT_ACCESS_EXPIRED);
    const refreshToken = (0, jwtTokenGenerate_1.generateJwtToken)(jwtPayload, envVariable_1.envData.JWT_REFRESH_SECRET, envVariable_1.envData.JWT_REFRESH_EXPIRED);
    return {
        accessToken,
        refreshToken
    };
};
exports.createUserJwtToken = createUserJwtToken;
// Generate A new Access Token If access token expired 
const newAccessTokenFromRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedRefreshToken = (0, jwtTokenGenerate_1.verifyJwtToken)(refreshToken, envVariable_1.envData.JWT_REFRESH_SECRET);
    const isUserExist = yield user_model_1.User.findOne({ email: verifiedRefreshToken.email });
    if (!isUserExist) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "User  does not exist.");
    }
    ;
    if (isUserExist.isActive === user_interface_1.isActive.Blocked || isUserExist.isActive === user_interface_1.isActive.Deleted) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `User is ${isUserExist.isActive}`);
    }
    ;
    const jwtTokenPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    };
    const accessToken = (0, jwtTokenGenerate_1.generateJwtToken)(jwtTokenPayload, envVariable_1.envData.JWT_ACCESS_SECRET, envVariable_1.envData.JWT_ACCESS_EXPIRED);
    return accessToken;
});
exports.newAccessTokenFromRefreshToken = newAccessTokenFromRefreshToken;
