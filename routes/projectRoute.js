import { addProject, getProjects } from "../controllers/projectController.js";
import express from "express";
import verifyToken from "../configs/verifyToken.js";

const ProjectRouter = express.Router();

ProjectRouter.post("/add", verifyToken, addProject);
ProjectRouter.get("/get", verifyToken, getProjects);

export default ProjectRouter;