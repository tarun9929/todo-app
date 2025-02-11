import express from "express";
import { addTodo, getTodos } from "../controllers/todoControllers.js";

const todoRouter = express.Router();

todoRouter.route("/").post(addTodo).get(getTodos);

export default todoRouter;
