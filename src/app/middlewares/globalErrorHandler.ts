import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { issue } from "zod/v4/core/util.cjs";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleValidationError } from "../helpers/handleValidationError";
import { handleZodError } from "../helpers/handleZodError";

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
  let message = `Something went wrong!!`;

  if (err.code === 11000) {
    const duplicateError = handleDuplicateError(err);
    statusCode = duplicateError.statusCode;
    message = duplicateError.message;
  } else if (err.name === "CastError") {
    const castError = handleCastError(err);
    statusCode = castError.statusCode;
    message = castError.message;
  } else if (err.name === "ValidationError") {
    const validationError = handleValidationError(err);
    statusCode = validationError.statusCode;
    message = validationError.message;
  } else if (err.name === "ZodError") {
    const zodError = handleZodError(err);
    statusCode = zodError.statusCode;
    message = zodError.message;
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
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
