import { NextFunction, Request, Response } from "express";
import AuthService from "../../services/AuthService";

const verifyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({
      status: "error",
      error_message: "Token is required"
    });
  }

  try {
    const user = await AuthService.verifyAccount(token);
    
    return res.status(200).json({
      status: "success",
      data: {
        message: "Account verified successfully!",
        userId: user.id,
      },
    });
  } catch (error: any) {
    return res.status(400).json({
      status: "error",
      error_message: error.message,
    });
  }
};

export default verifyAccount;
