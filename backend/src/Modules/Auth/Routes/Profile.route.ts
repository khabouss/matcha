import { Router } from 'express';
import { authMiddleware } from '../../../middleware/authMiddleware';
import createProfileController from '../Controllers/profiles/CreateProfile';
import myProfile from '../Controllers/profiles/Me';
import GetProfileUsers from '../Controllers/profiles/GetProfile';
import whoViewedProfile from '../Controllers/profiles/WhoViewedProfile';

const attachProfileRoute = (router: Router) => {
    router.post('/', authMiddleware, createProfileController);
    router.get('/', authMiddleware, myProfile);
    router.get('/:profileId', authMiddleware, GetProfileUsers);
    router.get('/:profileId/viewers', authMiddleware, whoViewedProfile);
};

export default attachProfileRoute;
