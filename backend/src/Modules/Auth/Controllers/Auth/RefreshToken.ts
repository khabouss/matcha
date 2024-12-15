import { Request, Response, NextFunction } from "express";
import AuthService from "../../services/AuthService";
import jwt from "jsonwebtoken";

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({
      status: "error",
      error_message: "Refresh token is required",
    });
  }
  try {
    // const token = await AuthService.refreshToken(refreshToken);
    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET || "secret",
      (err: any, decoded: any) => {
        if (err) {
          return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Generate a new access token
        const newAccessToken = jwt.sign(
          { id: decoded.id, email: decoded.email },
          process.env.JWT_SECRET!,
          { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });
      }
    );

    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         token,
    //     },
    // });
  } catch (error: any) {
    res.status(400).json({
      status: "error",
      error_message: error.message,
    });
    next(error);
  }
};

export default refreshToken;
