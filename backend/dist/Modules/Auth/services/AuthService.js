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
const ulid_1 = require("ulid");
const userRepository_1 = require("../repositories/userRepository");
const userValidator_1 = require("../validators/userValidator");
const mailer_1 = require("../utils/mailer");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sessionRepository_1 = __importDefault(require("../repositories/sessionRepository"));
const resetPasswordRepository_1 = __importDefault(require("../repositories/resetPasswordRepository"));
const MatchaError_1 = __importDefault(require("../../../Exceptions/MatchaError"));
class AuthService {
    static verifyAccount(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token) {
                throw new Error('Token is required');
            }
            const verifyToken = yield userRepository_1.UserRepository.verifyAccount(token);
            if (!verifyToken) {
                throw new Error('Invalid token');
            }
            if (verifyToken.expiresat < new Date()) {
                throw new Error('Token expired');
            }
            const getUser = yield userRepository_1.UserRepository.findById(verifyToken.accountid);
            if (!getUser) {
                throw new Error('User not found');
            }
            yield userRepository_1.UserRepository.updateVerificationStatus(getUser.id, true);
            yield userRepository_1.UserRepository.deleteVerificationToken(token);
            return getUser;
        });
    }
    static createUser(userName, password, firstName, lastName, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const validationError = (0, userValidator_1.validateUserSignup)({
                userName,
                password,
                firstName,
                lastName,
                email,
            });
            if (!validationError.valid) {
                const errorMessage = validationError.errors.join(', ');
                throw new Error(errorMessage);
            }
            const findByEmail = yield userRepository_1.UserRepository.findByEmail(email);
            if (findByEmail) {
                throw new Error('Email already exists :)');
            }
            const findbyUserName = yield userRepository_1.UserRepository.findByUserName(userName);
            if (findbyUserName) {
                throw new Error('User already exists :)');
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const user = yield userRepository_1.UserRepository.createUser(userName, hashedPassword, firstName, lastName, email);
            const token = (0, ulid_1.ulid)();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            yield userRepository_1.UserRepository.putVerificationToken(token, user.id, expiresAt);
            yield (0, mailer_1.sendEmails)(email, token, 'verify-account');
            return user;
        });
    }
    static resetPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository_1.UserRepository.findByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }
            const resetToken = yield resetPasswordRepository_1.default.findByUserId(user.id);
            if (resetToken) {
                yield resetPasswordRepository_1.default.deleteToken(resetToken.token);
            }
            const token = (0, ulid_1.ulid)();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            yield userRepository_1.UserRepository.putResetPasswordToken(token, user.id, expiresAt);
            yield (0, mailer_1.sendEmails)(email, token, 'reset-password');
        });
    }
    static signIn(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository_1.UserRepository.findByUserName(username);
            if (!user) {
                throw new Error('User not found');
            }
            const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordMatch) {
                throw new Error('Invalid password');
            }
            //check if the user has existing refresh token
            const getRefreshToken = yield sessionRepository_1.default.findByUserId(user.id);
            if (getRefreshToken) {
                yield sessionRepository_1.default.removeByToken(getRefreshToken.token);
            }
        });
    }
    static newPassword(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const findToken = yield resetPasswordRepository_1.default.findByToken(token);
            if (!findToken) {
                throw new MatchaError_1.default('Invalid token');
            }
            console.log('find token', findToken);
            if (findToken.expiresat < new Date()) {
                throw new Error('Token expired');
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            console.log(hashedPassword);
            yield userRepository_1.UserRepository.updatePassword(hashedPassword, findToken.accountid);
            yield resetPasswordRepository_1.default.deleteToken(token);
        });
    }
}
exports.default = AuthService;
