import express, { Router, NextFunction, Request, Response, RequestHandler } from 'express';
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

// Helper type to convert our handlers to Express RequestHandler
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const wrapAsync = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

const attachAuthRoute = (router: Router): void => {
    router.post('/sign-in', wrapAsync(signIn));
    router.post('/sign-up', wrapAsync(createAccount));
    router.post('/verify-account', wrapAsync(verifyAccount));
    router.post('/reset-password', wrapAsync(resetPassword));
    router.post('/refresh-token', wrapAsync(refreshToken));
    router.post('/new-password', wrapAsync(newPassword));
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
