"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsyncTryCatchHandler = void 0;
const catchAsyncTryCatchHandler = (func) => (req, res, next) => {
    Promise.resolve(func(req, res, next))
        .catch((err) => {
        next(err);
    });
};
exports.catchAsyncTryCatchHandler = catchAsyncTryCatchHandler;
