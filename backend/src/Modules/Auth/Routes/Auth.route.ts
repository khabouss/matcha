import express, { Router, NextFunction, Request, Response } from 'express';
import { UserRepository } from '../repositories/userRepository';
import { validateUserSignup } from '../validators/userValidator';
import { ulid } from 'ulid';
import AuthService from '../services/AuthService';
import verifyAccount from '../Controllers/Auth/VerifyAccount';
import createAccount from '../Controllers/Auth/CreateAccount';
import resetPassword from '../Controllers/Auth/ResetPassword';
import signIn from '../Controllers/Auth/SignIn';
import refreshToken from '../Controllers/Auth/RefreshToken';
import { authMiddleware } from '../../../middleware/authMiddleware';
import newPassword from '../Controllers/Auth/NewPassword';
const { sendEmails } = require('../utils/mailer');

const attachAuthRoute = (router: Router) => {
    router.post('/sign-in', signIn);
    router.post('/sign-up', createAccount);
    router.post('/verify-account', verifyAccount);
    router.post('/reset-password', resetPassword);
    router.post('/refresh-token', refreshToken);
    router.post('/new-password', newPassword);
    router.post('/protected', authMiddleware, (req: Request, res: Response) => {
        res.status(200).json({
            status: 'success',
            data: {
                message: `Hello, , you're authorized!`,
            },
        });
    });
};

export default attachAuthRoute;
