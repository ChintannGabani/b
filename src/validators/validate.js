import { AppError } from "../utils/AppError.js";

export const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(
        { ...req.body, ...req.params, ...req.query },
        { abortEarly: false, allowUnknown: true }
    );

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        throw new AppError(422, "Validation failed", errorMessages);
    }

    next();
};
