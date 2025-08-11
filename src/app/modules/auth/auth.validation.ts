import z from "zod";

export const loginZodSchema = z.object({
  phone: z.string({ message: "Phone number must be a string" }),
  password: z.string({ message: "Password must be a string" }),
});
export const changePasswordZodSchema = z.object({
  oldPassword: z.string({ message: "Old password must be a string" }),
  password: z.string({ message: "New password must be a string" }),
});

export const forgotPasswordZodSchema = z.object({
  email: z.string({ message: "Email must be a string" }).email(),
});
