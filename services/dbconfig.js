import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

const connection = process.env.MONGO_DB_URL;

async function databaseConnect() {
  try {
    await mongoose.connect(connection);
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("Connection failed:", err.message);
  }
}

export default databaseConnect;
