import { Request, Response, NextFunction } from "express";
import AuthService from "../../services/AuthService";
import { UserRepository } from "../../repositories/userRepository";
import jwt from "jsonwebtoken";
import SessionRepository from "../../repositories/sessionRepository";

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      status: "error",
      error_message: "Email and password are required",
    });
  }
  try {
    await AuthService.signIn(username, password);
    const user = await UserRepository.findByUserName(username);
    if (!user) {
      res.status(400).json({
        status: "error",
        error_message: "User not found",
      });
    }

    const accesstoken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );
    // const deviceInfo = req.headers['user-agent'] || 'Unknown';
    // await SessionRepository.save({
    //     userId: user.id,
    //     refreshToken,
    //     deviceInfo,
    //     createdAt: new Date(),
    //     last_active: new Date(),
    // });

    // return token;
    res.status(200).json({
      status: "success",
      data: {
        message: "Sign in successfully!",
        accesstoken,
        refreshToken,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          isVerfied: user.isverified,
          // user
        },
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
export default signIn;
