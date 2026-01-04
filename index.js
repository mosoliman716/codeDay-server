import connectDB from "./configs/db.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import UserRoute from "./routes/userRoute.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", UserRoute);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});