"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, data) => {
    res.status(data.statusCode).json({
        message: data.message,
        statusCode: data.statusCode,
        success: data.success,
        data: data.data
    });
};
exports.sendResponse = sendResponse;
