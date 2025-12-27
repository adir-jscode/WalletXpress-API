import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { userControllers } from "./user.controller";
import { Role } from "./user.interface";
import { createUserZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);

router.get("/users", checkAuth(Role.ADMIN), userControllers.getUsers);
router.get("/agents", checkAuth(Role.ADMIN), userControllers.getAgents);
router.get("/me", checkAuth(...Object.values(Role)), userControllers.getMe);

export const userRoutes = router;
