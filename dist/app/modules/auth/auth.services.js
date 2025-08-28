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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = require("../../utils/AppError");
const user_model_1 = require("../users/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userTokens_1 = require("../../utils/userTokens");
const envVariable_1 = require("../../config/envVariable");
const checkReceiverUser_1 = require("../../utils/checkReceiverUser");
// User login with email and password and cookie set
const AuthLogIn = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "User Does Not Exist. Please register an account.");
    }
    // check receiver 
    (0, checkReceiverUser_1.checkReceiverUser)(isUserExist);
    const comparePassword = yield bcrypt_1.default.compare(password, isUserExist.password);
    if (!comparePassword) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Password does not match.");
    }
    const { accessToken, refreshToken } = (0, userTokens_1.createUserJwtToken)(isUserExist);
    const _a = isUserExist.toObject(), { password: _ } = _a, rest = __rest(_a, ["password"]);
    return {
        accessToken,
        refreshToken,
        user: rest
    };
});
// Reset User Password 
const resetUserPasswordService = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, oldPassword } = payload;
    const isUserExist = yield user_model_1.User.findById(decodedToken.userId);
    const oldPasswordMatch = yield bcrypt_1.default.compare(oldPassword, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password);
    if (!oldPasswordMatch) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_ACCEPTABLE, "Old Password does not match.");
    }
    isUserExist.password = yield bcrypt_1.default.hash(newPassword, Number(envVariable_1.envData.BCRYPT_HASH_ROUND));
    isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.save();
});
exports.AuthServices = {
    AuthLogIn,
    resetUserPasswordService
};
