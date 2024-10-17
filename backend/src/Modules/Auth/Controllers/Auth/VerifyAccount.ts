import { NextFunction, Request, Response } from 'express';
import AuthService from '../../services/AuthService';

const verifyAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { token } = req.body;
    try {
        const user = await AuthService.verifyAccount(token);
        console.log('user:', user);

        res.status(200).json({
            status: 'success',
            data: {
                message: 'Account verified successfully!',
                userId: user.id,
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

export default verifyAccount;
