import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError";

export const exceptionHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "An unexpected error occurred!";

  // Log the error for debugging purposes
  console.error("ERROR 💥", err);

  // Send a generic error response in production
  res.status(statusCode).json({
    status: statusCode < 500 ? "fail" : "error",
    message,
  });
};
