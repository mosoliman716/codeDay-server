import DBconnection from "./configs/db.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import UserRoute from "./routes/userRoute.js";
import ProblemRouter from "./routes/problemRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();
const DB = await DBconnection();
console.log("Using database:", DB.db.databaseName);


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", UserRoute);
app.use("/api/problems", ProblemRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});