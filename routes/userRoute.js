import { registerUser, loginUser, getUser } from "../controllers/userController.js";
import express from "express";

const UserRoute = express.Router();

UserRoute.post("/register", registerUser);
UserRoute.post("/login", loginUser);
UserRoute.get("/me", getUser);

export default UserRoute;