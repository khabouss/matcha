import { Request, Response, NextFunction } from "express";
import ProfileServices from "../../services/ProfileServices";

const swipeList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: "error",
        error_message: "Unauthorized",
      });
      return;
    }
    const { latitude, longitude } = req.query;
    console.log("============================");

    console.log("latitude", latitude);
    console.log("longitude", longitude);

    const swipeData = await ProfileServices.getSwipeList(req.user.id, {
      latitude: latitude ? parseFloat(latitude as string) : undefined,
      longitude: longitude ? parseFloat(longitude as string) : undefined,
    });
    res.status(200).json({
      status: "success",
      data: {
        swipeData,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "error",
      error_message: error.message,
    });
  }
};
export default swipeList;
