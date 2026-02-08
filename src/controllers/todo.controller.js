import { Todo } from "../models/todo.model.js";
import { AppError } from "../utils/AppError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createTodo = async (req, res, next) => {
    try {
        const { content, categoryId, description, priority, dueDate } = req.body;

        if (!content || !categoryId) {
            throw new AppError(400, "Content and Category ID are required");
        }

        let todo = await Todo.create({
            content,
            description,
            priority,
            dueDate,
            category: categoryId,
            createdBy: req.user._id,
            isComplete: false
        });

        todo = await todo.populate('category', 'name');

        return res
            .status(201)
            .json(new ApiResponse(201, todo, "Todo created successfully"));
    } catch (error) {
        next(error);
    }
};

const getAllTodos = async (req, res, next) => {
    try {
        const { search, priority, isComplete } = req.query;

        const matchStage = {
            createdBy: new mongoose.Types.ObjectId(req.user._id)
        };

        if (search) {
            matchStage.content = { $regex: search, $options: "i" };
        }

        if (priority && priority !== 'all') {
            matchStage.priority = priority;
        }

        if (isComplete !== undefined && isComplete !== 'all') {
            matchStage.isComplete = isComplete === 'true';
        }

        const todos = await Todo.aggregate([
            {
                $match: matchStage
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryDetails",
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    category: {
                        $first: "$categoryDetails"
                    }
                }
            },
            {
                $project: {
                    categoryDetails: 0
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        return res
            .status(200)
            .json(new ApiResponse(200, todos, "Todos fetched successfully"));
    } catch (error) {
        next(error);
    }
};

const updateTodo = async (req, res, next) => {
    try {
        const { todoId } = req.params;
        const { content, isComplete, description, priority, dueDate } = req.body;

        const updateData = {};
        if (content !== undefined) updateData.content = content;
        if (isComplete !== undefined) updateData.isComplete = isComplete;
        if (description !== undefined) updateData.description = description;
        if (priority !== undefined) updateData.priority = priority;
        if (dueDate !== undefined) updateData.dueDate = dueDate;

        const todo = await Todo.findOneAndUpdate(
            {
                _id: todoId,
                createdBy: req.user._id
            },
            {
                $set: updateData
            },
            { new: true }
        ).populate('category', 'name');

        if (!todo) {
            throw new AppError(404, "Todo not found or unauthorized");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, todo, "Todo updated successfully"));

    } catch (error) {
        next(error);
    }
};

const deleteTodo = async (req, res, next) => {
    try {
        const { todoId } = req.params;

        const todo = await Todo.findOneAndDelete({
            _id: todoId,
            createdBy: req.user._id
        });

        if (!todo) {
            throw new AppError(404, "Todo not found or unauthorized");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Todo deleted successfully"));

    } catch (error) {
        next(error);
    }
};

export { createTodo, getAllTodos, updateTodo, deleteTodo };
