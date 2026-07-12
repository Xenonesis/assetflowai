"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, LoginValues } from "../validators/auth-schemas";
import { login } from "../actions/auth-actions";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    setError(null);
    const result = await login(values);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Welcome back</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Enter your email to sign in to your account
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
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[var(--text-primary)]">Password</Label>
            <Link href="/forgot-password" className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            {...form.register("password")}
            className="border-[var(--border)] focus:ring-[var(--primary)]"
          />
          {form.formState.errors.password && (
            <p className="text-sm text-[var(--danger)]">{form.formState.errors.password.message}</p>
          )}
        </div>
        <Button 
          type="submit" 
          className="w-full bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] rounded-md h-10 transition-colors"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <div className="text-center text-sm">
        <span className="text-[var(--text-secondary)]">Don&apos;t have an account? </span>
        <Link href="/signup" className="font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]">
          Sign up
        </Link>
      </div>
    </div>
  );
}
