import { Request, Response, NextFunction } from 'express';
import ProfileServices from '../../services/ProfileServices';

const createProfileController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log('user: ', req.user);

    const {
        gender,
        sexual_preferences,
        biography,
        fame_rating,
        gps_location,
        neighborhood,
        allow_gps,
    } = req.body;

    console.log('req.body: ', req.body);

    try {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                error_message: 'Unauthorized',
            });
            return;
        }
        const dataProfile = {
            user_id: req.user.id,
            gender,
            sexual_preferences,
            biography,
            fame_rating,
            gps_location,
            neighborhood,
            allow_gps,
        };
        const profile = await ProfileServices.createProfile(dataProfile);
        console.log('profile: ', profile);
        res.status(200).json({
            status: 'success',
            data: {
                message: 'Profile created successfully!',
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

export default createProfileController;
