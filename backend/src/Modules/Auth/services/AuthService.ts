import { ulid } from 'ulid';
import { UserRepository } from '../repositories/userRepository';
import { validateUserSignup } from '../validators/userValidator';
const { sendEmails } = require('../utils/mailer');
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import SessionRepository from '../repositories/sessionRepository';
import ResetPasswordRepository from '../repositories/resetPasswordRepository';
import MatchaError from '../../../Exceptions/MatchaError';

class AuthService {
    static async verifyAccount(token: string) {
        if (!token) {
            throw new Error('Token is required');
        }

        const verifyToken = await UserRepository.verifyAccount(token);
        if (!verifyToken) {
            throw new Error('Invalid token');
        }

        if (verifyToken.expiresat < new Date()) {
            throw new Error('Token expired');
        }

        const getUser = await UserRepository.findById(verifyToken.accountid);
        if (!getUser) {
            throw new Error('User not found');
        }

        await UserRepository.updateVerificationStatus(getUser.id, true);

        await UserRepository.deleteVerificationToken(token);

        return getUser;
    }
    static async createUser(
        userName: string,
        password: string,
        firstName: string,
        lastName: string,
        email: string
    ) {
        const validationError = validateUserSignup({
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
        const findByEmail = await UserRepository.findByEmail(email);
        if (findByEmail) {
            throw new Error('Email already exists :)');
        }
        const findbyUserName = await UserRepository.findByUserName(userName);
        if (findbyUserName) {
            throw new Error('User already exists :)');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserRepository.createUser(
            userName,
            hashedPassword,
            firstName,
            lastName,
            email
        );
        const token = ulid();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await UserRepository.putVerificationToken(token, user.id, expiresAt);
        await sendEmails(email, token, 'verify-account');

        return user;
    }
    static async resetPassword(email: string) {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        const resetToken = await ResetPasswordRepository.findByUserId(user.id);
        if (resetToken) {
            await ResetPasswordRepository.deleteToken(resetToken.token);
        }
        const token = ulid();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await UserRepository.putResetPasswordToken(token, user.id, expiresAt);
        await sendEmails(email, token, 'reset-password');
    }
    static async signIn(username: string, password: string) {
        const user = await UserRepository.findByUserName(username);
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error('Invalid password');
        }
        //check if the user has existing refresh token
        const getRefreshToken = await SessionRepository.findByUserId(user.id);
        if (getRefreshToken) {
            await SessionRepository.removeByToken(getRefreshToken.token);
        }
    }
    static async newPassword(token: string, password: string) {
        const findToken = await ResetPasswordRepository.findByToken(token);

        if (!findToken) {
            throw new MatchaError('Invalid token');
        }
        console.log('find token', findToken);
        if (findToken.expiresat < new Date()) {
            throw new Error('Token expired');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        await UserRepository.updatePassword(
            hashedPassword,
            findToken.accountid
        );

        await ResetPasswordRepository.deleteToken(token);
    }
}

export default AuthService;
