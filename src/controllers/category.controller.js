import { Category } from "../models/category.model.js";
import { AppError } from "../utils/AppError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            throw new AppError(400, "Category name is required");
        }

        const category = await Category.create({
            name,
            createdBy: req.user._id,
        });

        return res
            .status(201)
            .json(new ApiResponse(201, category, "Category created successfully"));
    } catch (error) {
        next(error);
    }
};

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({ createdBy: req.user._id });
        return res
            .status(200)
            .json(new ApiResponse(200, categories, "Categories fetched successfully"));
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const { name } = req.body;

        if (!name) {
            throw new AppError(400, "Category name is required");
        }

        const category = await Category.findOneAndUpdate(
            {
                _id: categoryId,
                createdBy: req.user?._id
            },
            {
                $set: { name }
            },
            { new: true }
        );

        if (!category) {
            throw new AppError(404, "Category not found or unauthorized");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, category, "Category updated successfully"));

    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;

        const category = await Category.findOneAndDelete({
            _id: categoryId,
            createdBy: req.user?._id
        });

        if (!category) {
            throw new AppError(404, "Category not found or unauthorized");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Category deleted successfully"));
    } catch (error) {
        next(error);
    }
}

export { createCategory, getCategories, updateCategory, deleteCategory };
