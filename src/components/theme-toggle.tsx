"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const getIcon = () => {
    if (theme === "light") return <Sun className="w-[18px] h-[18px]" />;
    if (theme === "dark") return <Moon className="w-[18px] h-[18px]" />;
    return <Monitor className="w-[18px] h-[18px]" />;
  };

  const getLabel = () => {
    if (theme === "light") return "Light Mode";
    if (theme === "dark") return "Dark Mode";
    return "System Mode";
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="w-9 h-9 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors border border-[var(--border)] bg-[var(--surface)]"
      title={`Theme: ${getLabel()}. Click to change.`}
      aria-label="Toggle theme"
    >
      {getIcon()}
    </Button>
  );
}
