import DBconnection from "./configs/db.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import lusca from "lusca";
import UserRoute from "./routes/userRoute.js";
import ProblemRouter from "./routes/problemRoute.js";
import ProjectRouter from "./routes/projectRoute.js";
import TaskRouter from "./routes/taskRoute.js";
import cookieParser from "cookie-parser";
import apiLimiter from "./middlewares/rateLimit.js";
import session from "express-session";

dotenv.config();
const DB = await DBconnection();
const csrfProtection = lusca.csrf();

console.log("Using database:", DB.db.databaseName);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "X-CSRF-Token"],
  }),
);

app.use(express.json());
app.use(cookieParser());

// session is required for lusca's CSRF token storage
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

app.use(csrfProtection);

// Endpoint to fetch CSRF token
app.get("/api/csrf-token", (req, res) => {
  try {
    res.json({ csrfToken: req.csrfToken() });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate CSRF token" });
  }
});

app.use("/api/users", UserRoute);
app.use("/api/problems", ProblemRouter);
app.use("/api/projects", ProjectRouter);
app.use("/api/tasks", TaskRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
