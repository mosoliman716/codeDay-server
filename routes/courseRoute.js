import { addCourse, getCourses, deleteCourse } from "../controllers/courseController.js";
import express from "express";
import verifyToken from "../configs/verifyToken.js";

const courseRouter = express.Router();
courseRouter.post("/add", verifyToken, addCourse);
courseRouter.get("/get", verifyToken, getCourses);
courseRouter.delete("/delete", verifyToken, deleteCourse);



export default courseRouter;