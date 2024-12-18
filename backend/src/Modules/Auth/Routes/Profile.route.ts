import { NextFunction, Router } from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import createProfileController from "../Controllers/profiles/CreateProfile";
import myProfile from "../Controllers/profiles/Me";
import GetProfileUsers from "../Controllers/profiles/GetProfile";
import whoViewedProfile from "../Controllers/profiles/WhoViewedProfile";
import swipeList from "../Controllers/profiles/SwipeList";
import multer from "multer";
import myProfileDetails from "../Controllers/profiles/MyProfileDetails";

const attachProfileRoute = (router: Router) => {
  router.post("/", authMiddleware, createProfileController);
  router.get("/me", authMiddleware, myProfile);
  router.get("/swipe-list", authMiddleware, swipeList);
  router.get("/me/viewers", authMiddleware, whoViewedProfile);
  router.get("/:profileUserName", authMiddleware, GetProfileUsers);
  router.get("/me/details", authMiddleware, myProfileDetails);
};

export default attachProfileRoute;
