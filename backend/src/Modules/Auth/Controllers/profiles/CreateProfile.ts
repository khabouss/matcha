import { Request, Response, NextFunction } from "express";
import ProfileServices from "../../services/ProfileServices";
import { s3Client } from "../../../..";
import { PutObjectCommand } from "@aws-sdk/client-s3";
const bucketName = "test-bucket";
const createProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("user: ", req.user);

  const {
    gender,
    sexual_preferences,
    biography,
    fame_rating,
    gps_location,
    neighborhood,
    allow_gps,
    images,
    interests,
  } = req.body;

  console.log("req.body: ", req.body);

  try {
    if (!req.user) {
      res.status(401).json({
        status: "error",
        error_message: "Unauthorized",
      });
      return;
    }
    // Check if files were uploaded
   

    console.log("images: ", images);
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
      interests,
    };
    const profile = await ProfileServices.createProfile(dataProfile);
    console.log("profile: ", profile);
    res.status(200).json({
      status: "success",
      data: {
        message: "Profile created successfully!",
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

export default createProfileController;
