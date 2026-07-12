import { SignupForm } from "@/features/auth/components/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | AssetFlow AI",
  description: "Create your AssetFlow AI account.",
};

export default function SignupPage() {
  return <SignupForm />;
}
