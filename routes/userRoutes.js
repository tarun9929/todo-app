import { Router } from "express";
import userAuth from "../middlewares/userAuth.js";
import {
  login,
  refreshToken,
  register,
  verifyEmail,
} from "../controllers/userControllers.js";

const userRouter = Router();

userRouter.post("/register", register);

userRouter.get("/register/:token", verifyEmail);

userRouter.get("/register/get/token", refreshToken);

userRouter.post("/login", login);

export default userRouter;
