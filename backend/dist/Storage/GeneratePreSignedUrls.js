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
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const __1 = require("..");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
class GeneratePreSignedUrls {
    static generatePreSignedUrls(fileKeys, bucketName, expiration) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: bucketName,
                Key: fileKeys,
            });
            const url = yield (0, s3_request_presigner_1.getSignedUrl)(__1.s3Client, command, {
                expiresIn: expiration,
            });
            return url.replace("localstack", "localhost").split("?")[0];
            // return url;
        });
    }
}
GeneratePreSignedUrls.escapeRegExp = (word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
GeneratePreSignedUrls.GenerateKey = () => (0, uuid_1.v4)().replace(new RegExp(GeneratePreSignedUrls.escapeRegExp("-"), "g"), "");
exports.default = GeneratePreSignedUrls;
