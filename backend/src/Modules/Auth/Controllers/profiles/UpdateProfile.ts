import { Request, Response, NextFunction } from "express";
import ProfileServices from "../../services/ProfileServices";

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: "error",
        error_message: "Unauthorized",
      });

      return;
    }
    const {
      gender,
      sexual_preferences,
      biography,
      fame_rating,
      gps_location,
      neighborhood,
      allow_gps,
      images,
    } = req.body;

    const dataProfile = {
      user_id: req.user.id,
      gender,
      sexual_preferences,
      biography,
      fame_rating,
      gps_location,
      neighborhood,
      allow_gps,
      images,
    };
    const profile = await ProfileServices.updateProfile(dataProfile);
    res.status(200).json({
      status: "success",
      data: {
        message: "Profile updated successfully!",
        images,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "error",
      error_message: error.message,
    });
    next(error);
  }
};
export default updateProfile;
