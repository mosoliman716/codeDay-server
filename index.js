import dotenv from "dotenv";
import DBconnection from "./configs/db.js";
import app from "./server.js";

dotenv.config();

const DB = await DBconnection();
const PORT = process.env.PORT || 5000;

console.log("Using database:", DB.db.databaseName);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
