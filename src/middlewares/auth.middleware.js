import { AppError } from "../utils/AppError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
    try {
        const token =
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new AppError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password");

        if (!user) {
            throw new AppError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        next(new AppError(401, error?.message || "Invalid access token"));
    }
};
