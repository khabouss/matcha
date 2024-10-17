import { NextFunction, Request, Response } from 'express';
import AuthService from '../../services/AuthService';

const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email } = req.body;
    try {
        const user = await AuthService.resetPassword(email);
        res.status(200).json({
            status: 'success',
            data: {
                message: 'Reset password link sent to your email!',
            },
        });
    } catch (error: any) {
        res.status(400).json({
            status: 'error',
            error_message: error.message,
        });
        next(error);
    }
};
export default resetPassword;
