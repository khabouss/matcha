import { Request, Response, NextFunction, response } from 'express';
import ProfileServices from '../../services/ProfileServices';

const GetProfileUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const profileId = req.params.profileId;

    console.log('profileId: ', profileId);
    console.log('user: ', req.user);
    if (!req.user) {
        res.status(401).json({
            status: 'error',
            error_message: 'Unauthorized',
        });
        return;
    }
    const viewerId = req.user.id; // get the user id from the token

    try {
        const profile = await ProfileServices.getProfileUsers(
            Number(profileId)
        );
        if (!profile) {
            res.status(404).json({
                status: 'error',
                error_message: 'Profile not found',
            });
            return;
        }
        if (Number(profileId) !== viewerId) {
            await ProfileServices.setViewerProfile(Number(profileId), viewerId);
        }

        const { user_id, gps_location, allow_gps, ...returndata } = profile;

        res.status(200).json({
            status: 'success',
            data: {
                message: 'Profile fetched successfully!',
                data: {
                    ...returndata,
                },
            },
        });
    } catch (error: any) {
        res.status(400).json({
            status: 'error',
            error_message: error.message,
        });
    }
};

export default GetProfileUsers;
