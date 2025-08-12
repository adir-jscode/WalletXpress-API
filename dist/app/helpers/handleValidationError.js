"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = void 0;
const handleValidationError = (err) => {
    const errorSources = [];
    const errorSource = Object.values(err.errors);
    errorSource.forEach((errorObject) => errorSources.push({ path: errorObject.path, message: errorObject.message }));
    return {
        statusCode: 400,
        message: "Validation Error",
        errorSource: errorSources,
    };
};
exports.handleValidationError = handleValidationError;
