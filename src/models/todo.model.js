import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true,
        },
        isComplete: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
            required: false,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        dueDate: {
            type: Date,
            required: false,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Todo = mongoose.model("Todo", todoSchema);
