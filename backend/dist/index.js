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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const app_1 = __importDefault(require("./app"));
const db_1 = require("./db");
const addDataToDatabase_1 = __importDefault(require("./db/addDataToDatabase"));
const PORT = process.env.PORT || 3001;
// const s3 = new AWS.S3({
//     region: 'us-east-1',  // Change to your preferred region
//     endpoint: 'http://localhost:4566',  // LocalStack endpoint
//     accessKeyId: 'test',      // Dummy access key
//     secretAccessKey: 'test',  // Dummy secret key
//     // s3ForcePathStyle: true,   // Ensure path-style URLs are used for LocalStack
//   });
exports.s3Client = new client_s3_1.S3Client({
    region: "us-east-1",
    endpoint: "http://localstack:4566",
    credentials: {
        accessKeyId: (_a = process.env.AWS_ACCESS_KEY) !== null && _a !== void 0 ? _a : "",
        secretAccessKey: (_b = process.env.AWS_SECRET_ACCESS_KEY) !== null && _b !== void 0 ? _b : "",
    },
    forcePathStyle: true,
});
const bucketName = "test-bucket";
const createBucket = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the bucket already exists
        yield exports.s3Client.send(new client_s3_1.HeadBucketCommand({ Bucket: bucketName }));
        console.log(`Bucket "${bucketName}" already exists.`);
        yield setBucketCors(bucketName);
    }
    catch (error) {
        if (error.name === "NotFound") {
            // If the bucket doesn't exist, create it
            yield exports.s3Client.send(new client_s3_1.CreateBucketCommand({ Bucket: bucketName }));
            console.log(`Bucket "${bucketName}" created.`);
            yield setBucketCors(bucketName);
        }
        else {
            console.error(error);
        }
    }
});
const setBucketCors = (bucketName) => __awaiter(void 0, void 0, void 0, function* () {
    const corsParams = {
        Bucket: bucketName,
        CORSConfiguration: {
            CORSRules: [
                {
                    AllowedHeaders: ["*"],
                    AllowedMethods: ["PUT", "GET", "POST", "HEAD", "DELETE"],
                    AllowedOrigins: ["*"],
                    ExposeHeaders: ["ETag"],
                    MaxAgeSeconds: 3000,
                },
            ],
        },
    };
    try {
        yield exports.s3Client.send(new client_s3_1.PutBucketCorsCommand(corsParams));
        console.log("CORS configuration applied successfully.");
    }
    catch (error) {
        console.error("Error setting CORS configuration:", error);
    }
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.createSchemas)(); // Create all schemas before starting the server
        console.log("Schemas created successfully");
        // Seed the database with initial data
        yield (0, addDataToDatabase_1.default)();
        console.log("Database seeded successfully");
        yield createBucket();
        console.log("Bucket created successfully");
        app_1.default.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start the server:", error);
        process.exit(1); // Exit process if schema creation fails
    }
});
startServer();
