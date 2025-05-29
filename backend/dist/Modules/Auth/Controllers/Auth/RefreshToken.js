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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(400).json({
            status: "error",
            error_message: "Refresh token is required",
        });
    }
    try {
        // const token = await AuthService.refreshToken(refreshToken);
        jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET || "secret", (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid refresh token" });
            }
            // Generate a new access token
            const newAccessToken = jsonwebtoken_1.default.sign({ id: decoded.id, email: decoded.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
            res.json({ accessToken: newAccessToken });
        });
        // res.status(200).json({
        //     status: 'success',
        //     data: {
        //         token,
        //     },
        // });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            error_message: error.message,
        });
        next(error);
    }
});
exports.default = refreshToken;
