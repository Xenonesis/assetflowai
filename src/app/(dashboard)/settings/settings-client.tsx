"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export { User, Shield, Building2 } from "lucide-react";

export function ThemeToggleCard() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm space-y-4">
      <h2 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--border)] pb-2">
        <Eye className="w-4 h-4 text-amber-500" />
        Visual Customization Preferences
      </h2>
      <div className="space-y-3">
        <span className="text-xs text-[var(--text-secondary)] block">System Appearance Theme</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setTheme("light")}
            className={`flex-1 border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] ${
              theme === "light" ? "ring-1 ring-[var(--primary)] bg-[var(--primary)]/5" : ""
            }`}
          >
            <Sun className="w-4 h-4 mr-2" />
            Light
          </Button>
          <Button
            variant="outline"
            onClick={() => setTheme("dark")}
            className={`flex-1 border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] ${
              theme === "dark" ? "ring-1 ring-[var(--primary)] bg-[var(--primary)]/5" : ""
            }`}
          >
            <Moon className="w-4 h-4 mr-2" />
            Dark
          </Button>
          <Button
            variant="outline"
            onClick={() => setTheme("system")}
            className={`flex-1 border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] ${
              theme === "system" ? "ring-1 ring-[var(--primary)] bg-[var(--primary)]/5" : ""
            }`}
          >
            <Laptop className="w-4 h-4 mr-2" />
            System Default
          </Button>
        </div>
      </div>
    </div>
  );
}
