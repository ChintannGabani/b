import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use((req, res, next) => {
    next();
});

import { ApiResponse } from './utils/ApiResponse.js';

app.get('/', async (req, res, next) => {
    try {
        res.status(200).json(new ApiResponse(200, {}, "API is running..."));
    } catch (error) {
        next(error);
    }
});

import userRouter from './routes/user.routes.js';
import categoryRouter from './routes/category.routes.js';
import todoRouter from './routes/todo.routes.js';

app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/todos", todoRouter);

import { errorMiddleware } from './middlewares/error.middleware.js';
app.use(errorMiddleware);

export default app;
