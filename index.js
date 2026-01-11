import DBconnection from "./configs/db.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import UserRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();
const DB = await DBconnection();
console.log("Using database:", DB.db.databaseName);


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    withCredentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", UserRoute);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});