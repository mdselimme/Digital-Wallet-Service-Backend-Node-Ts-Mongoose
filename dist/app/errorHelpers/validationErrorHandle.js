"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = void 0;
const handleValidationError = (err) => {
    const errorSources = [];
    const errors = Object.values(err.errors);
    errors.forEach((errObj) => errorSources.push({
        path: errObj.path,
        message: errObj.message
    }));
    return {
        statusCode: 400,
        message: "Validation Error.",
        errorSources
    };
};
exports.handleValidationError = handleValidationError;
