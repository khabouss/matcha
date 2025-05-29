"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MatchaError extends Error {
    constructor(message, statusCode = 500) {
        super();
        this.message = message;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, MatchaError.prototype);
    }
}
exports.default = MatchaError;
