"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const VerifyAccount_1 = __importDefault(require("../Controllers/Auth/VerifyAccount"));
const CreateAccount_1 = __importDefault(require("../Controllers/Auth/CreateAccount"));
const ResetPassword_1 = __importDefault(require("../Controllers/Auth/ResetPassword"));
const SignIn_1 = __importDefault(require("../Controllers/Auth/SignIn"));
const RefreshToken_1 = __importDefault(require("../Controllers/Auth/RefreshToken"));
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const NewPassword_1 = __importDefault(require("../Controllers/Auth/NewPassword"));
const attachAuthRoute = (router) => {
    router.post('/sign-in', SignIn_1.default);
    router.post('/sign-up', CreateAccount_1.default);
    router.post('/verify-account', VerifyAccount_1.default);
    router.post('/reset-password', ResetPassword_1.default);
    router.post('/refresh-token', RefreshToken_1.default);
    router.post('/new-password', NewPassword_1.default);
    router.post('/protected', authMiddleware_1.authMiddleware, (req, res) => {
        res.status(200).json({
            status: 'success',
            data: {
                message: `Hello, , you're authorized!`,
            },
        });
    });
};
exports.default = attachAuthRoute;
