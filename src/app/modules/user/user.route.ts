import { Router } from "express";
import { userControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);

export const userRoutes = router;
