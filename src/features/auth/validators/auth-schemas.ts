import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export type SignupValues = z.infer<typeof signupSchema>;

export const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
