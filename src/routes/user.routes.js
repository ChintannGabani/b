import { Router } from "express";
import {
    loginUser,
    registerUser,
    updateAccountDetails,
    getCurrentUser
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../validators/validate.js";
import { userRegisterSchema, userLoginSchema, userUpdateSchema } from "../validators/user.validator.js";

const router = Router();

router.use((req, res, next) => {
    next();
});

router.route("/register").post(
    upload.single("avatar"),
    validate(userRegisterSchema),
    registerUser
);

router.route("/login").post(
    validate(userLoginSchema),
    loginUser
);

router.route("/update-account").patch(
    verifyJWT,
    upload.single("avatar"),
    validate(userUpdateSchema),
    updateAccountDetails
);
router.route("/current-user").get(verifyJWT, getCurrentUser);

export default router;
