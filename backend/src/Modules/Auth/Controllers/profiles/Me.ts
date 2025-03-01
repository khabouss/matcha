import { Request, Response, NextFunction } from "express";
import ProfileServices from "../../services/ProfileServices";

const myProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: "error",
        error_message: "Unauthorized",
      });
      return;
    }
    const getProfile = await ProfileServices.getMyProfile(req.user.id);
    const verfiyProfileOwner = await ProfileServices.verfiyProfileOwner(
      Number(getProfile.id),
      req.user.id
    );
    const viewsArray = Object.values(verfiyProfileOwner);
    res.status(200).json({
      status: "success",
      data: {
        message: "Profile fetched successfully!",
        data: {
          getProfile,
          viewsArray,
        },
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "error",
      error_message: error.message,
    });
  }
};

export default myProfile;
