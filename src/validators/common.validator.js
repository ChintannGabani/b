import Joi from "joi";

export const mongoIdSchema = (idName) => Joi.object({
    [idName]: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
        "string.pattern.base": `Invalid ${idName}`
    })
});
