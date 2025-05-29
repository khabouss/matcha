"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        // Capture the stack trace, excluding this constructor
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
