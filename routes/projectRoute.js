import { addProject, getProjects, editProject, deleteProject } from "../controllers/projectController.js";
import express from "express";
import verifyToken from "../configs/verifyToken.js";

const ProjectRouter = express.Router();

ProjectRouter.post("/add", verifyToken, addProject);
ProjectRouter.get("/get", verifyToken, getProjects);
ProjectRouter.put("/edit", verifyToken, editProject);
ProjectRouter.delete("/delete", verifyToken, deleteProject);

export default ProjectRouter;