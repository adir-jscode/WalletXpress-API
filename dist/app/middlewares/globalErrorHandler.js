"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const handleDuplicateError_1 = require("../helpers/handleDuplicateError");
const handleCastError_1 = require("../helpers/handleCastError");
const handleValidationError_1 = require("../helpers/handleValidationError");
const handleZodError_1 = require("../helpers/handleZodError");
const globalErrorHandler = (err, req, res, next) => {
    if (env_1.envVars.NODE_ENV === "development") {
        console.log(err.issues);
    }
    let errorSource = [];
    let statusCode = 500;
    let message = `Something went wrong!!`;
    if (err.code === 11000) {
        const duplicateError = (0, handleDuplicateError_1.handleDuplicateError)(err);
        statusCode = duplicateError.statusCode;
        message = duplicateError.message;
    }
    else if (err.name === "CastError") {
        const castError = (0, handleCastError_1.handleCastError)(err);
        statusCode = castError.statusCode;
        message = castError.message;
    }
    else if (err.name === "ValidationError") {
        const validationError = (0, handleValidationError_1.handleValidationError)(err);
        statusCode = validationError.statusCode;
        message = validationError.message;
        errorSource = validationError.errorSource;
    }
    else if (err.name === "ZodError") {
        const zodError = (0, handleZodError_1.handleZodError)(err);
        statusCode = zodError.statusCode;
        message = zodError.message;
        errorSource = zodError.errorSource;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSource,
        err: env_1.envVars.NODE_ENV === "development" ? err : null,
        stack: env_1.envVars.NODE_ENV === "development" ? err.stack : null,
    });
};
exports.globalErrorHandler = globalErrorHandler;
