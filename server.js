import express from "express";
import { configDotenv } from "dotenv";
import databaseConnect from "./services/dbconfig.js";
import router from "./Route/userRoute.js";

databaseConnect()
configDotenv();
const app = express();
app.use(express.json())


app.listen(process.env.PORT, () => {
  console.log("app is listening to port", process.env.PORT);
});

app.use(router)


