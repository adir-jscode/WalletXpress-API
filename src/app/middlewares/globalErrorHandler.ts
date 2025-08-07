import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { issue } from "zod/v4/core/util.cjs";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVars.NODE_ENV === "development") {
    console.log(err.issues);
  }

  const errorSource: any = [];
  let statusCode = 500;
  let message = `Something went wrong!! ${err.message}`;

  if (err.code === 11000) {
    statusCode = 400;
    const matchedArray = err.message.match(/"([^"]*)"/);
    message = `${matchedArray[1]} is already exists`;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid MongoDb ObjectID. Please provide a valid id";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors);
    errors.forEach((objectObject: any) =>
      errorSource.push({
        path: objectObject.path,
        message: objectObject.message,
      })
    );
    message = "validation error";
  } else if (err.name === "ZodError") {
    statusCode = 400;
    message = "Zod Error";
    err.issues.forEach((issue: any) =>
      errorSource.push({
        path: issue.path[issue.path.length - 1],
        message: issue.message,
      })
    );
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    err,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
