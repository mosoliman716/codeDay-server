import { addProblem, getProblems, editProblem, deleteProblem } from "../controllers/problemController.js";
import express from "express";
import verifyToken from "../configs/verifyToken.js";

const ProblemRouter = express.Router();

ProblemRouter.post("/add", verifyToken, addProblem);
ProblemRouter.get("/get", verifyToken, getProblems);
ProblemRouter.put("/edit", verifyToken, editProblem);
ProblemRouter.delete("/delete", verifyToken, deleteProblem);


export default ProblemRouter;