import { registerUser, loginUser } from "../controllers/userController.js";
import express from "express";

const UserRoute = express.Router();

UserRoute.post("/register", registerUser);
UserRoute.post("/login", loginUser);

export default UserRoute;