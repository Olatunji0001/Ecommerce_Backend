import express from "express";
import { configDotenv } from "dotenv";
import databaseConnect from "./services/dbconfig.js";
import router from "./Route/userRoute.js";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
//console.log(fs.existsSync("./images/sample.jpg"));

// Load env variables
configDotenv();

// Connect to database
databaseConnect();

// Create express app
const app = express();

// ✅ Middleware setup
app.use(
  cors({
    origin: [
      "http://localhost:3000",                 // for local testing
      "https://nexus-buy.vercel.app",         // ✅ correct - no trailing slash!
    ],
    credentials: true,
  })
);

app.use(express.json()); // allow backend to read JSON from frontend

// ✅ Use router
app.use(router);

// Start the server
app.listen(process.env.PORT, () => {
  console.log("App is listening on port", process.env.PORT);
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

(async () => {
  const result = await cloudinary.uploader.upload("./images/sample.jpg");
  //console.log("Image uploaded successfully:", result);
  const url = cloudinary.url(result.public_id, {
    transformation: [
      { width: 500, height: 1000, crop: "fill" },
      { quality: "auto", fetch_format: "auto", crop: "fill", gravity: "auto" },
    ],
  });
  //console.log("Transformed image URL:", url);
})();
