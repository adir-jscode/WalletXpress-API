import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  loginZodSchema,
  changePasswordZodSchema,
  resetPasswordZodSchema,
  forgotPasswordZodSchema,
} from "./auth.validation";

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
router.post(
  "/forget-password",
  validateRequest(forgotPasswordZodSchema),
  AuthControllers.forgetPassword
);
router.post(
  "/reset-password",
  validateRequest(resetPasswordZodSchema),
  AuthControllers.resetPassword
);

export const authRoutes = router;
