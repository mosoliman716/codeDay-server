import { addTask, getTasks, editTask, deleteTask } from "../controllers/taskController.js";
import express from "express";
import verifyToken from "../configs/verifyToken.js";

const TaskRouter = express.Router();
TaskRouter.post("/add", verifyToken, addTask);
TaskRouter.get("/get", verifyToken, getTasks);
TaskRouter.put("/edit", verifyToken, editTask);
TaskRouter.delete("/delete", verifyToken, deleteTask);


export default TaskRouter;