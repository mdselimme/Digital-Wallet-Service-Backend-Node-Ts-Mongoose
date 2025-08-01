"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodValidationError = void 0;
const handleZodValidationError = (err) => {
    const errorSources = [];
    err.issues.forEach((issue) => {
        errorSources.push({
            path: issue.path[issue.path.length - 1],
            message: issue.message
        });
    });
    return {
        statusCode: 400,
        message: "Zod Validation Error.",
        errorSources
    };
};
exports.handleZodValidationError = handleZodValidationError;
