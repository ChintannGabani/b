import { ApiResponse } from "../utils/ApiResponse.js";
import { AppError } from "../utils/AppError.js";
import { User } from "../models/user.model.js";

const registerUser = async (req, res, next) => {
    try {
        const { username, email, fullName, password } = req.body;

        if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
            throw new AppError(400, "All fields are required");
        }

        const existedUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existedUser) {
            throw new AppError(409, "User with email or username already exists");
        }

        const avatarLocalPath = req.file?.path;

        if (!avatarLocalPath) {
            throw new AppError(400, "Avatar file is required");
        }

        let avatar = avatarLocalPath.replace(/\\/g, "/");
        if (avatar.startsWith("public/")) {
            avatar = avatar.replace("public/", "");
        }
        if (!avatar.startsWith("/")) {
            avatar = "/" + avatar;
        }

        const user = await User.create({
            fullName,
            email,
            password,
            username: username.toLowerCase(),
            avatar,
        });

        const createdUser = await User.findById(user._id).select("-password");

        if (!createdUser) {
            throw new AppError(500, "Something went wrong while registering the user");
        }

        return res.status(200).json(
            new ApiResponse(200, createdUser, "User registered successfully")
        );
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;

        if (!username && !email) {
            throw new AppError(400, "Username or email is required");
        }

        const user = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (!user) {
            throw new AppError(404, "User does not exist");
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            throw new AppError(401, "Invalid user credentials");
        }

        const accessToken = user.generateAccessToken();

        const loggedInUser = await User.findById(user._id).select("-password");

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { user: loggedInUser, accessToken },
                    "User logged in successfully"
                )
            );
    } catch (error) {
        next(error);
    }
};

const updateAccountDetails = async (req, res, next) => {
    const { fullName, username } = req.body;

    if (!fullName && !username && !req.file) {
        throw new AppError(400, "At least one field is required to update");
    }

    try {
        const updateData = {};
        if (fullName) updateData.fullName = fullName;
        if (username) updateData.username = username;

        if (req.file) {
            let avatarPath = req.file.path.replace(/\\/g, "/");
            if (avatarPath.startsWith("public/")) {
                avatarPath = avatarPath.replace("public/", "");
            }
            if (!avatarPath.startsWith("/")) {
                avatarPath = "/" + avatarPath;
            }
            updateData.avatar = avatarPath;
        }

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: updateData
            },
            { new: true }
        ).select("-password");

        return res
            .status(200)
            .json(new ApiResponse(200, user, "Account details updated successfully"));

    } catch (error) {
        next(error);
    }
};

const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        return res
            .status(200)
            .json(new ApiResponse(200, user, "User fetched successfully"));
    } catch (error) {
        next(error);
    }
};

export { registerUser, loginUser, updateAccountDetails, getCurrentUser };
