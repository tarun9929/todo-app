import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./connection.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

connectDatabase()
  .then(() => {
    console.log("database has been connected successfully");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.listen(PORT, (err) => {
  if (err) console.log(err.message);

  console.log(`server started at http://localhost:${PORT}`);
});
