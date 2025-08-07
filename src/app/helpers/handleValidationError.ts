import mongoose from "mongoose";
import {
  TErrorSources,
  TGenericErrorResponse,
} from "../interfaces/error.types";

export const handleValidationError = (
  err: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];
  const errorSource = Object.values(err.errors);
  errorSource.forEach((errorObject: any) =>
    errorSources.push({ path: errorObject.path, message: errorObject.message })
  );

  return {
    statusCode: 400,
    message: "Validation Error",
    errorSource: errorSources,
  };
};
