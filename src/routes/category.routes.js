import { Router } from "express";
import { createCategory, getCategories, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../validators/validate.js";
import { categoryCreateSchema } from "../validators/todo.validator.js";
import { mongoIdSchema } from "../validators/common.validator.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
    .post(
        validate(categoryCreateSchema),
        createCategory
    )
    .get(getCategories);

router.route("/:categoryId")
    .patch(
        validate(mongoIdSchema("categoryId")),
        validate(categoryCreateSchema),
        updateCategory
    )
    .delete(
        validate(mongoIdSchema("categoryId")),
        deleteCategory
    );

export default router;
