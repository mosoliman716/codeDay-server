import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let mainConnection = null;
function getDb(dbName, options = { useCache: true }) {
  if (!mongoose.connection || mongoose.connection.readyState !== 1) {
    throw new Error("Main connection not established. Call connectDB() first.");
  }
  return mongoose.connection.useDb(dbName, options);
}

async function DBconnection() {
  try {
    mainConnection = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      "Database connected successfully",
    );
    return getDb("CodeDay");
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
}



export default DBconnection;


