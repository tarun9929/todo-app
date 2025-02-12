import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./connection.js";
import userRouter from "./routes/userRoutes.js";
import userAuth from "./middlewares/userAuth.js";
import todoRouter from "./routes/todoRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

connectDatabase()
  .then(() => {
    console.log("database has been connected successfully");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/users", userRouter);
app.use("/api/todos", userAuth, todoRouter);

app.listen(PORT, (err) => {
  if (err) console.log(err.message);

  console.log(`server started at ${process.env.BASE_URL}:${PORT}`);
});
