import { Router } from "express";
import {
  login,
  register,
  verifyEmail,
} from "../controllers/userControllers.js";

const userRouter = Router();

userRouter.post("/register", register);

userRouter.get("/register/:token", verifyEmail);

userRouter.post("/login", login);

export default userRouter;
