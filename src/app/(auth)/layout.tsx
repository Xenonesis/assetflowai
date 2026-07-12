import { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[var(--background)]">
      {/* Left Panel - Branding */}
      <div className="hidden md:flex flex-col justify-between p-10 bg-[var(--surface-elevated)] border-r border-[var(--border)]">
        <Link href="/" className="group">
          <Logo className="text-[var(--primary)] font-bold text-xl" iconClassName="w-6 h-6" />
        </Link>
        <div className="max-w-md">
          <h2 className="text-3xl font-display font-semibold text-[var(--text-primary)] mb-4">
            Enterprise Intelligence Platform
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Manage every physical asset, employee allocation, shared resource, maintenance workflow, and audit process from one centralized, AI-powered ecosystem.
          </p>
        </div>
        <div className="text-sm text-[var(--text-muted)]">
          © {new Date().getFullYear()} AssetFlow AI. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="flex md:hidden items-center justify-center mb-8 group">
            <Logo textClassName="text-xl font-bold" iconClassName="w-6 h-6" />
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
