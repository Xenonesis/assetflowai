"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { CommandPalette } from "@/components/command-palette";
import { Shield, LayoutDashboard, Users, Box, Wrench, Calendar, ClipboardCheck, Settings, Bell, Search, LogOut, ArrowLeftRight, BarChart3, History, Building2, Menu, X, ChevronLeft } from "lucide-react";
import { AIAssistant } from "@/features/ai/components/ai-assistant";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // 1. Listen for Ctrl + K to toggle command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 2. Real-time Notifications Listener subscription
  useEffect(() => {
    const supabase = createClient();
    let channel: any = null;
    let isMounted = true;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || !isMounted) return;

      channel = supabase
        .channel(`realtime-notifications-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload: any) => {
            toast.info(payload.new.title || "New Alert", {
              description: payload.new.message,
              action: payload.new.link ? {
                label: "View",
                onClick: () => router.push(payload.new.link),
              } : undefined,
            });
          }
        )
        .subscribe();
    });

    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [router]);

  const navItems = (isCol: boolean) => (
    <>
      <div className={`text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-3 mt-4 transition-opacity duration-200 ${isCol ? "opacity-0 h-0 overflow-hidden mt-0" : "opacity-100"}`}>Overview</div>
      <NavLink href="/dashboard" icon={<LayoutDashboard size={18} />} isCollapsed={isCol}>Dashboard</NavLink>
      
      <div className={`text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-3 mt-6 transition-opacity duration-200 ${isCol ? "opacity-0 h-0 overflow-hidden mt-0" : "opacity-100"}`}>Core</div>
      <NavLink href="/assets" icon={<Box size={18} />} isCollapsed={isCol}>Assets</NavLink>
      <NavLink href="/allocations" icon={<Users size={18} />} isCollapsed={isCol}>Allocations</NavLink>
      <NavLink href="/transfers" icon={<ArrowLeftRight size={18} />} isCollapsed={isCol}>Transfers</NavLink>
      
      <div className={`text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-3 mt-6 transition-opacity duration-200 ${isCol ? "opacity-0 h-0 overflow-hidden mt-0" : "opacity-100"}`}>Workflows</div>
      <NavLink href="/maintenance" icon={<Wrench size={18} />} isCollapsed={isCol}>Maintenance</NavLink>
      <NavLink href="/bookings" icon={<Calendar size={18} />} isCollapsed={isCol}>Bookings</NavLink>
      <NavLink href="/audits" icon={<ClipboardCheck size={18} />} isCollapsed={isCol}>Audits</NavLink>
      
      <div className={`text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-3 mt-6 transition-opacity duration-200 ${isCol ? "opacity-0 h-0 overflow-hidden mt-0" : "opacity-100"}`}>Administration</div>
      <NavLink href="/organization" icon={<Building2 size={18} />} isCollapsed={isCol}>Organization</NavLink>
      <NavLink href="/reports" icon={<BarChart3 size={18} />} isCollapsed={isCol}>Reports</NavLink>
      <NavLink href="/activity" icon={<History size={18} />} isCollapsed={isCol}>Activity Logs</NavLink>
      <NavLink href="/settings" icon={<Settings size={18} />} isCollapsed={isCol}>Settings</NavLink>
    </>
  );

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[var(--surface-elevated)] border-r border-[var(--border)] flex flex-col md:hidden animate-in slide-in-from-left duration-200">
            <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)]">
              <Link href="/dashboard" className="group" onClick={() => setIsMobileOpen(false)}>
                <Logo textClassName="text-lg font-bold" iconClassName="w-5 h-5" />
              </Link>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] rounded-md"
              >
                <X size={18} />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1" onClick={() => setIsMobileOpen(false)}>
              {navItems(false)}
            </nav>
            
            <div className="p-4 border-t border-[var(--border)]">
              <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-md transition-colors">
                <LogOut size={18} />
                <span>Sign out</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className={`bg-[var(--surface-elevated)] border-r border-[var(--border)] hidden md:flex flex-col transition-all duration-300 ease-in-out shrink-0 ${isCollapsed ? "w-16" : "w-64"}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border)]">
          {!isCollapsed && (
            <Link href="/dashboard" className="group overflow-hidden whitespace-nowrap">
              <Logo textClassName="text-lg font-bold" iconClassName="w-5 h-5" />
            </Link>
          )}
          {isCollapsed && (
            <Link href="/dashboard" className="mx-auto block group" title="AssetFlow AI">
              <Logo mode="icon" iconClassName="w-5 h-5" />
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] rounded-md hidden md:block"
          >
            <ChevronLeft size={18} className={`transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems(isCollapsed)}
        </nav>
        
        <div className="p-4 border-t border-[var(--border)]">
          <button 
            className={`flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-md transition-colors py-2 ${isCollapsed ? "justify-center w-full px-0" : "w-full px-3 gap-3"}`}
            title={isCollapsed ? "Sign out" : undefined}
          >
            <LogOut size={18} />
            <span className={`transition-all duration-200 ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] rounded-md md:hidden"
            >
              <Menu size={20} />
            </button>
            
            {/* Global Search */}
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input 
                type="text" 
                placeholder="Search assets, users, or press Ctrl+K..." 
                onClick={() => setIsCommandPaletteOpen(true)}
                readOnly
                className="w-full pl-9 pr-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)] cursor-pointer"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="/notifications"
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background)] rounded-full transition-colors relative"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--danger)] rounded-full border border-[var(--surface)]"></span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-medium text-sm">
              JD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>

      <AIAssistant />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
    </div>
  );
}

function NavLink({ href, icon, children, isCollapsed = false }: { href: string; icon: ReactNode; children: ReactNode; isCollapsed?: boolean }) {
  return (
    <Link 
      href={href}
      className={`flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] rounded-md transition-colors py-2 ${isCollapsed ? "justify-center gap-0 px-0" : "px-3 gap-3"}`}
      title={isCollapsed ? String(children) : undefined}
    >
      {icon}
      <span className={`transition-all duration-200 ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
        {children}
      </span>
    </Link>
  );
}
