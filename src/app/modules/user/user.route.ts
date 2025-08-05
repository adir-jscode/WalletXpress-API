import { Router } from "express";
import { userControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);

router.get("/", checkAuth(Role.ADMIN, Role.USER), userControllers.getUsers);

export const userRoutes = router;
