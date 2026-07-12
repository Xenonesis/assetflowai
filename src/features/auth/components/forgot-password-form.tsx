"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { resetPasswordSchema, ResetPasswordValues } from "../validators/auth-schemas";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ResetPasswordValues) {
    setError(null);
    setSuccess(false);
    
    // Simulating forgot password server action
    // const result = await resetPassword(values.email);
    // if (result?.error) { setError(result.error); }
    // else { setSuccess(true); }
    
    setTimeout(() => {
      setSuccess(true);
    }, 1000);
  }

  if (success) {
    return (
      <div className="w-full max-w-sm mx-auto space-y-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-[var(--success)]/10 flex items-center justify-center text-[var(--success)]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Check your email</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          We've sent a password reset link to your email address.
        </p>
        <div className="pt-4">
          <Link href="/login">
            <Button variant="outline" className="w-full border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]">
              Back to log in
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Reset password</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-[var(--danger)] bg-[var(--danger)]/10 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[var(--text-primary)]">Email</Label>
          <Input
            id="email"
            placeholder="m@example.com"
            {...form.register("email")}
            className="border-[var(--border)] focus:ring-[var(--primary)]"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-[var(--danger)]">{form.formState.errors.email.message}</p>
          )}
        </div>
        <Button 
          type="submit" 
          className="w-full bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] rounded-md h-10 transition-colors"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Sending..." : "Send reset link"}
        </Button>
      </form>
      <div className="text-center text-sm">
        <Link href="/login" className="font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]">
          Back to log in
        </Link>
      </div>
    </div>
  );
}
