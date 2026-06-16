import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { OtpControllers } from "./otp.controller";
import { sendOtpZodSchema, verifyOtpZodSchema } from "./otp.validation";

const router = Router();

router.post("/send", validateRequest(sendOtpZodSchema), OtpControllers.sendOtp);
router.post(
  "/verify",
  validateRequest(verifyOtpZodSchema),
  OtpControllers.verifyOtp,
);

export const OtpRoutes = router;
