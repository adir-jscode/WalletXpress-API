import { name } from "ejs";
import z from "zod";

export const sendOtpZodSchema = z.object({
  email: z.string({ message: "Email is required" }).email(),
  name: z.string({ message: "Name is required" }).min(2).max(100),
});
export const verifyOtpZodSchema = z.object({
  email: z.string({ message: "Email is required" }).email(),
  otp: z.string({ message: "OTP is required" }).min(6),
});
