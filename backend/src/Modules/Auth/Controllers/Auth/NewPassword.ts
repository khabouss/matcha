import { NextFunction, Request, Response } from "express";
import AuthService from "../../services/AuthService";

const newPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { token, password } = req.body;
  if (!token) {
    res.status(400).json({
      status: "error",
      error_message: "token is required",
    });
  }
  if (!password) {
    res.status(400).json({
      status: "error",
      error_message: "password is required",
    });
  }

  try {
    const newpass = AuthService.newPassword(token, password);
    res.status(201).json({
      status: "success",
      data: {},
    });
  } catch (error: any) {
    res.status(400).json({
      status: "error",
      error_message: error.message,
    });
    next(error);
  }
};

export default newPassword;
