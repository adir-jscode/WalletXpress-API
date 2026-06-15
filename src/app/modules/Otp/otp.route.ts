import { Router } from "express";
import { rateLimitMiddleware } from "../../middlewares/rateLimit";
import { validateRequest } from "../../middlewares/validateRequest";
import { OtpControllers } from "./otp.controller";
import { sendOtpZodSchema, verifyOtpZodSchema } from "./otp.validation";

const router = Router();

router.post(
  "/send",
  rateLimitMiddleware,
  validateRequest(sendOtpZodSchema),
  OtpControllers.sendOtp,
);
router.post(
  "/verify",
  rateLimitMiddleware,
  validateRequest(verifyOtpZodSchema),
  OtpControllers.verifyOtp,
);

export const OtpRoutes = router;
