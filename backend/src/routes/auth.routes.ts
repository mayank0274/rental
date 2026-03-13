import { Router } from "express";
import {
    register,
    login,
    me,
    logout,
} from "../controllers/auth.controller.ts";
import { authenticate } from "../middlewares/authenticate.middleware.ts";

const authRouter = Router();

// Public routes
authRouter.post("/register", register);
authRouter.post("/login", login);

// Protected routes — require valid cookie JWT
authRouter.get("/me", authenticate, me);
authRouter.post("/logout", authenticate, logout);

export default authRouter;
