import { ReactNode } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[var(--background)]">
      {/* Left Panel - Branding */}
      <div className="hidden md:flex flex-col justify-between p-10 bg-[var(--surface-elevated)] border-r border-[var(--border)]">
        <div className="flex items-center gap-2 text-[var(--primary)] font-bold text-xl">
          <Shield className="w-6 h-6" />
          <span>AssetFlow AI</span>
        </div>
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
          <div className="flex md:hidden items-center justify-center gap-2 text-[var(--primary)] font-bold text-xl mb-8">
            <Shield className="w-6 h-6" />
            <span>AssetFlow AI</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
