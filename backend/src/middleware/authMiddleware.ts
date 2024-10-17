import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRepository } from '../Modules/Auth/repositories/userRepository';

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            status: 'error',
            error_message: 'Unauthorized',
        });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        console.log('decoded', decoded);
        if (typeof decoded === 'string') {
            res.status(401).json({
                status: 'error',
                error_message: 'Unauthorized',
            });
            return;
        }
        const decodedToken = jwt.decode(token) as JwtPayload;
        const users = await UserRepository.findById(decodedToken.id);
        if (!users) {
            req.user = null;
            return next();
        }
        req.user = {
            id: users.id,
            email: users.email,
        };

        return next();
    } catch (error: any) {
        res.status(401).json({
            status: 'error',
            error_message: error.message,
        });
        return;
    }
};