import { Request, Response, NextFunction } from 'express';
import ProfileServices from '../../services/ProfileServices';

const whoViewedProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const profileId = req.params.profileId;
    if (!req.user) {
        res.status(401).json({
            status: 'error',
            error_message: 'Unauthorized',
        });
        return;
    }
    const userId = req.user.id; // The logged-in user

    try {
        const verfiyProfileOwner = await ProfileServices.verfiyProfileOwner(
            Number(profileId),
            userId
        );
        const viewsArray = Object.values(verfiyProfileOwner);

        if (!req.user) {
            res.status(401).json({
                status: 'error',
                error_message: 'Unauthorized',
            });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: {
                message: 'Profile fetched successfully!',
                data: viewsArray,
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

export default whoViewedProfile;
