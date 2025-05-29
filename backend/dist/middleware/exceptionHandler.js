"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exceptionHandler = void 0;
const AppError_1 = require("./AppError");
const exceptionHandler = (err, req, res, next) => {
    const statusCode = err instanceof AppError_1.AppError ? err.statusCode : 500;
    const message = err.message || "An unexpected error occurred!";
    // Log the error for debugging purposes
    console.error("ERROR 💥", err);
    // Send a generic error response in production
    res.status(statusCode).json({
        status: statusCode < 500 ? "fail" : "error",
        message,
    });
};
exports.exceptionHandler = exceptionHandler;
