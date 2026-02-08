import Joi from "joi";

const userRegisterSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(3).required(),
    fullName: Joi.string().required(),
    password: Joi.string().min(6).required(),
});

const userLoginSchema = Joi.object({
    email: Joi.string().email(),
    username: Joi.string(),
    password: Joi.string().required(),
}).or("email", "username");

const userUpdateSchema = Joi.object({
    fullName: Joi.string().min(1),
    username: Joi.string().min(3),
});

export { userRegisterSchema, userLoginSchema, userUpdateSchema };
