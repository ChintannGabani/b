import Joi from "joi";

const todoCreateSchema = Joi.object({
    content: Joi.string().required(),
    description: Joi.string().allow("").optional(),
    priority: Joi.string().valid("low", "medium", "high").default("medium"),
    dueDate: Joi.date().iso().optional(),
    categoryId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
        "string.pattern.base": "Invalid Category ID",
    }),
});

const todoUpdateSchema = Joi.object({
    content: Joi.string(),
    description: Joi.string().allow("").optional(),
    priority: Joi.string().valid("low", "medium", "high"),
    dueDate: Joi.date().iso().optional(),
    isComplete: Joi.boolean(),
    todoId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
}).or("content", "isComplete", "description", "priority", "dueDate");

const categoryCreateSchema = Joi.object({
    name: Joi.string().required(),
});

export { todoCreateSchema, todoUpdateSchema, categoryCreateSchema };
