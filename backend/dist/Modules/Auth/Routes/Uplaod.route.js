"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const preSignedUrl_controller_1 = __importDefault(require("../Controllers/storage/preSignedUrl.controller"));
const attachUplaodRoute = (router) => {
    router.post("/s3/presigned-url", preSignedUrl_controller_1.default);
};
exports.default = attachUplaodRoute;
