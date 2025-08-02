"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
const handleCastError = (err) => {
    return {
        statusCode: 400,
        message: `Invalid mongodb objectId. Please give a valid id. ${err.message}`
    };
};
exports.handleCastError = handleCastError;
