import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { loginZodSchema, changePasswordZodSchema } from "./auth.validation";

const router = Router();

router.post(
  "/login",
  validateRequest(loginZodSchema),
  AuthControllers.credentialsLogin
);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);
router.post(
  "/change-password",
  validateRequest(changePasswordZodSchema),
  checkAuth(...Object.values(Role)),
  AuthControllers.changePassword
);

export const authRoutes = router;
