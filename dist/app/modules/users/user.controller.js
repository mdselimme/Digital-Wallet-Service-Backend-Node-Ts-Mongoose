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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const catchAsyncTryCatch_1 = require("../../utils/catchAsyncTryCatch");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = require("http-status-codes");
const user_service_1 = require("./user.service");
// Create An User 
const createAnUser = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.createAnUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "User Created Successfully.",
        data: result,
        statusCode: http_status_codes_1.StatusCodes.CREATED
    });
}));
// Get All Users 
const getAllUsers = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.getAllUsers(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "All User Retrieved Successfully.",
        data: result,
        statusCode: http_status_codes_1.StatusCodes.OK
    });
}));
// Get Me Users 
const getMeUser = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield user_service_1.UserService.getMeUser(decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "My profile retrieved Successfully.",
        data: result,
        statusCode: http_status_codes_1.StatusCodes.OK
    });
}));
// Get Single User 
const getSingleUser = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.getSingleUser(req.params.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Get User Successfully",
        data: result,
        statusCode: http_status_codes_1.StatusCodes.OK
    });
}));
// Update An User 
const updateAnUser = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield user_service_1.UserService.updateAnUser(req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Update User Successfully",
        data: result,
        statusCode: http_status_codes_1.StatusCodes.OK
    });
}));
// Update An User Role
const updateAnUserRole = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const { email } = req.query;
    const result = yield user_service_1.UserService.updateAnUserRole(email, req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Update User Successfully",
        data: result,
        statusCode: http_status_codes_1.StatusCodes.OK
    });
}));
// Update An User Role
const updateAnUserStatus = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const { email } = req.query;
    const result = yield user_service_1.UserService.updateAnUserRole(email, req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Update User Successfully",
        data: result,
        statusCode: http_status_codes_1.StatusCodes.OK
    });
}));
// Update An User Role
const updateAnUserIsActive = (0, catchAsyncTryCatch_1.catchAsyncTryCatchHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const { email } = req.query;
    const result = yield user_service_1.UserService.updateAnUserIsActive(email, req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Update User Successfully",
        data: result,
        statusCode: http_status_codes_1.StatusCodes.OK
    });
}));
exports.UserController = {
    createAnUser,
    getAllUsers,
    getMeUser,
    getSingleUser,
    updateAnUser,
    updateAnUserRole,
    updateAnUserStatus,
    updateAnUserIsActive
};
