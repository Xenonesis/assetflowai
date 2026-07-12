import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | AssetFlow AI",
  description: "Reset your AssetFlow AI account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
