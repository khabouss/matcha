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
      first_name,
      last_name,
      email,
      gender,
      sexual_preferences,
      biography,
      fame_rating,
      gps_location,
      neighborhood,
      allow_gps,
      images,
      interests
    } = req.body;

    const dataProfile = {
      user_id: req.user.id,
      firstName: first_name,
      lastName: last_name,
      email,
      gender,
      sexual_preferences,
      biography,
      fame_rating,
      gps_location,
      neighborhood,
      allow_gps,
      images,
      interests
    };

    console.log('Received profile data:', dataProfile); // Debug log

    const profile = await ProfileServices.updateProfile(dataProfile);
    res.status(200).json({
      status: "success",
      data: {
        message: "Profile updated successfully!",
        images,
      },
    });
  } catch (error: any) {
    console.error('Profile update error:', error); // Debug log
    res.status(400).json({
      status: "error",
      error_message: error.message,
    });
  }
};
export default updateProfile;
