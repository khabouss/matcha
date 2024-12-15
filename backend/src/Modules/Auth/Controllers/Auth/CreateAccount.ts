import { NextFunction, Request, Response } from "express";
import AuthService from "../../services/AuthService";

const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, userName, firstName, lastName } = req.body;
  try {
    const user = await AuthService.createUser(
      userName,
      password,
      firstName,
      lastName,
      email
    );

    res.status(201).json({
      status: "success",
      data: {
        id: user.id,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export default createAccount;
