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

router.get("/users", checkAuth(Role.ADMIN), userControllers.getUsers);
router.get("/agents", checkAuth(Role.ADMIN), userControllers.getAgents);

export const userRoutes = router;
