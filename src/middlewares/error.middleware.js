import { AppError } from "../utils/AppError.js";

const errorMiddleware = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof AppError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Something went wrong";
        error = new AppError(statusCode, message, error?.errors || [], err.stack);
    }

    const response = {
        ...error,
        message: error.message,
        ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
    };

    return res.status(error.statusCode).json(response);
};

export { errorMiddleware };
