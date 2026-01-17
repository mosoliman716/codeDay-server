import { addProblem, getProblems } from "../controllers/problemController.js";
import express from "express";
import verifyToken from "../configs/verifyToken.js";

const ProblemRouter = express.Router();

ProblemRouter.post("/add", verifyToken, addProblem);
ProblemRouter.get("/get", verifyToken, getProblems);

export default ProblemRouter;