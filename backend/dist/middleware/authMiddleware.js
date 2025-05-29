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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = require("../Modules/Auth/repositories/userRepository");
const profileRepository_1 = __importDefault(require("../Modules/Auth/repositories/profileRepository"));
const multer_1 = __importDefault(require("multer"));
// Set up multer for file upload
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            status: "error",
            error_message: "Unauthorized",
        });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        console.log("decoded", decoded);
        if (typeof decoded === "string") {
            res.status(401).json({
                status: "error",
                error_message: "Unauthorized",
            });
            return;
        }
        const decodedToken = jsonwebtoken_1.default.decode(token);
        const users = yield userRepository_1.UserRepository.findById(decodedToken.id);
        if (!users) {
            req.user = null;
            return next();
        }
        console.error("users", users);
        const profileUser = yield profileRepository_1.default.findProfileByUserId(users.id);
        // if (!profileUser) {
        //     console.log('profileUser', profileUser);
        //     res.status(422).json({
        //         status: 'error',
        //         error_message: 'PROFILE_NOT_COMPLETED',
        //     });
        //     return;
        // }
        req.user = {
            id: users.id,
            email: users.email,
        };
        return next();
    }
    catch (error) {
        res.status(401).json({
            status: "error",
            error_message: error.message,
        });
        return;
    }
});
exports.authMiddleware = authMiddleware;
