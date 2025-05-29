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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GeneratePreSignedUrls_1 = __importDefault(require("../../../../Storage/GeneratePreSignedUrls"));
const preSignedUrlController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const key = GeneratePreSignedUrls_1.default.GenerateKey();
        const uploadfileImage = yield GeneratePreSignedUrls_1.default.generatePreSignedUrls(key, "test-bucket", 300);
        return res.status(200).json({
            message: "Pre-signed URL generated successfully",
            fileUrl: uploadfileImage,
        });
    }
    catch (error) {
        console.error("Error uploading file:", error);
        next(error);
    }
});
exports.default = preSignedUrlController;
