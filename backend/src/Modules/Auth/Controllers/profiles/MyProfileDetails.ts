import { Request, Response, NextFunction } from "express";
import ProfileServices from "../../services/ProfileServices";

const myProfileDetails = async (
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
    const getProfile = await ProfileServices.getMyProfileDetails(req.user.id);
    res.status(200).json({
      status: "success",
      data: getProfile,
    });
  } catch (error: any) {
    console.log("error: ", error);
    next(error);
  }
};

export default myProfileDetails;
