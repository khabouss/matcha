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
        const resData = {
            name: 'Alice khabouss',
            isMatch: true,
            lastOnlineStatus: 'Two weeks ago',
            about: {
                gender: 'Man',
                SP: 'Straight',
                interest1: 'Jogging',
                interest2: 'Coffee',
                intereset3: 'Movies',
                fame: 'fame: 3.12',
            },
            languages: ['english', 'arabic', 'russian'],
            lastLocation: 'Marrakech',
            age: 25,
            bio: 'Love traveling and photography.',
            image: [
                'https://picsum.photos/400/600?random=1',
                'https://picsum.photos/400/600?random=1',
                'https://picsum.photos/400/600?random=1',
                'https://picsum.photos/400/600?random=1',
                'https://picsum.photos/400/600?random=1',
            ],
            offsetX: 0,
            rotate: 0,
            opacity: 1,
        };
        res.status(200).json({
            status: 'success',
            data: {
                message: 'Profile fetched successfully!',
                profile: resData,
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
