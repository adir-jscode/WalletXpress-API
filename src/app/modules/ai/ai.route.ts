import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AIControllers } from "./ai.controller";

export const aiRoutes = Router();

aiRoutes.post(
  "/chat",
  checkAuth(Role.USER, Role.AGENT, Role.ADMIN),
  AIControllers.chat,
);
