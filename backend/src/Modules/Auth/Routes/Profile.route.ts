import { NextFunction, Router } from 'express';
import { authMiddleware, uploadImagesMiddleware } from '../../../middleware/authMiddleware';
import createProfileController from '../Controllers/profiles/CreateProfile';
import myProfile from '../Controllers/profiles/Me';
import GetProfileUsers from '../Controllers/profiles/GetProfile';
import whoViewedProfile from '../Controllers/profiles/WhoViewedProfile';
import swipeList from '../Controllers/profiles/SwipeList';


const attachProfileRoute = (router: Router) => {
    router.post('/', authMiddleware, uploadImagesMiddleware('profile', 5),createProfileController);
    router.get('/me', authMiddleware, myProfile);
    router.get('/swipe-list',authMiddleware, swipeList);
    router.get('/me/viewers', authMiddleware, whoViewedProfile);
    router.get('/:profileUserName', authMiddleware, GetProfileUsers);
};

export default attachProfileRoute;
