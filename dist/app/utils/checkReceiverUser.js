"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkReceiverUser = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_interface_1 = require("../modules/users/user.interface");
const AppError_1 = require("./AppError");
const checkReceiverUser = (receiverUser) => {
    // if receiver not approve 
    if (receiverUser.userStatus !== user_interface_1.IStatus.Approve) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `Account status is ${receiverUser.userStatus}. Please contact our support.`);
    }
    ;
    // if receiver not verified 
    if (!receiverUser.isVerified) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `Account status is not verified.`);
    }
    ;
    // if receiver not active 
    if (receiverUser.isActive !== user_interface_1.isActive.Active) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `Account status is ${receiverUser.isActive}. Please contact our support.`);
    }
    ;
};
exports.checkReceiverUser = checkReceiverUser;
