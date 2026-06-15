import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { rateLimitMiddleware } from "../../middlewares/rateLimit";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { AuthControllers } from "./auth.controller";
import {
  changePasswordZodSchema,
  forgotPasswordZodSchema,
  loginZodSchema,
  resetPasswordZodSchema,
} from "./auth.validation";

const router = Router();

router.post(
  "/login",
  rateLimitMiddleware,
  validateRequest(loginZodSchema),
  AuthControllers.credentialsLogin,
);
router.post(
  "/refresh-token",
  rateLimitMiddleware,
  AuthControllers.getNewAccessToken,
);
router.post("/logout", rateLimitMiddleware, AuthControllers.logout);
router.post(
  "/change-password",
  rateLimitMiddleware,
  validateRequest(changePasswordZodSchema),
  checkAuth(...Object.values(Role)),
  AuthControllers.changePassword,
);
router.post(
  "/forget-password",
  rateLimitMiddleware,
  validateRequest(forgotPasswordZodSchema),
  AuthControllers.forgetPassword,
);
router.post(
  "/reset-password",
  rateLimitMiddleware,
  validateRequest(resetPasswordZodSchema),
  AuthControllers.resetPassword,
);

export const authRoutes = router;
