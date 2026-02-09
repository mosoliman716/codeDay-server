import { addCourse, getCourses } from "../controllers/courseController.js";
import express from "express";
import verifyToken from "../configs/verifyToken.js";

const courseRouter = express.Router();
courseRouter.post("/add", verifyToken, addCourse);
courseRouter.get("/get", verifyToken, getCourses);



export default courseRouter;