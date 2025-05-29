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
const AuthService_1 = __importDefault(require("../../services/AuthService"));
const userRepository_1 = require("../../repositories/userRepository");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({
            status: "error",
            error_message: "Email and password are required",
        });
    }
    try {
        yield AuthService_1.default.signIn(username, password);
        const user = yield userRepository_1.UserRepository.findByUserName(username);
        if (!user) {
            res.status(400).json({
                status: "error",
                error_message: "User not found",
            });
        }
        const accesstoken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
        // const deviceInfo = req.headers['user-agent'] || 'Unknown';
        // await SessionRepository.save({
        //     userId: user.id,
        //     refreshToken,
        //     deviceInfo,
        //     createdAt: new Date(),
        //     last_active: new Date(),
        // });
        // return token;
        res.status(200).json({
            status: "success",
            data: {
                message: "Sign in successfully!",
                accesstoken,
                refreshToken,
                data: {
                    id: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    isVerfied: user.isverified,
                    // user
                },
            },
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            error_message: error.message,
        });
        next(error);
    }
});
exports.default = signIn;
