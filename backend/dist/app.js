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
const express_1 = __importDefault(require("express"));
const Auth_route_1 = __importDefault(require("./Modules/Auth/Routes/Auth.route"));
const Profile_route_1 = __importDefault(require("./Modules/Auth/Routes/Profile.route"));
const cors_1 = __importDefault(require("cors"));
const client_s3_1 = require("@aws-sdk/client-s3");
const index_1 = require("./index");
const multer_1 = __importDefault(require("multer"));
const exceptionHandler_1 = require("./middleware/exceptionHandler");
const Uplaod_route_1 = __importDefault(require("./Modules/Auth/Routes/Uplaod.route"));
const bucketName = "test-bucket";
// Set up multer for file upload
const storage = multer_1.default.memoryStorage(); // Store files in memory
const upload = (0, multer_1.default)({ storage: storage });
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "*" }));
app.get("/", (req, res) => {
    res.send("Hello, TypeScript with Express!");
});
app.post("/upload-imge", upload.single("file"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`;
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
    };
    try {
        // Upload the file to S3
        const data = yield index_1.s3Client.send(new client_s3_1.PutObjectCommand(params));
        console.log("File uploaded successfully:", data);
        return res.status(200).json({
            message: "File uploaded successfully",
            fileName: fileName,
            fileUrl: `http://localstack:4566/${bucketName}/${fileName}`, // URL for LocalStack, adjust if using AWS
        });
    }
    catch (error) {
        console.error("Error uploading file:", error);
        // return res.status(500).send('Error uploading file');
        next(error);
    }
}));
const authRouter = express_1.default.Router();
const profileRouter = express_1.default.Router();
const uplaodRouter = express_1.default.Router();
/** AUTH */
(0, Auth_route_1.default)(authRouter);
/** PROFILE */
(0, Profile_route_1.default)(profileRouter);
/** UPLOAD */
(0, Uplaod_route_1.default)(uplaodRouter);
// seedDatabase();
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/upload", uplaodRouter);
// write script that can insert data into the database
app.use(exceptionHandler_1.exceptionHandler);
exports.default = app;
