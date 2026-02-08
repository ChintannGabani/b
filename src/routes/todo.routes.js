import { Router } from "express";
import { createTodo, getAllTodos, updateTodo, deleteTodo } from "../controllers/todo.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../validators/validate.js";
import { todoCreateSchema, todoUpdateSchema } from "../validators/todo.validator.js";
import { mongoIdSchema } from "../validators/common.validator.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
    .post(
        validate(todoCreateSchema),
        createTodo
    )
    .get(getAllTodos);

router.route("/:todoId")
    .patch(
        validate(mongoIdSchema("todoId")),
        validate(todoUpdateSchema),
        updateTodo
    )
    .delete(
        validate(mongoIdSchema("todoId")),
        deleteTodo
    );

export default router;
