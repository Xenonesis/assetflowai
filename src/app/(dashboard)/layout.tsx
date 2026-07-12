import { ReactNode } from "react";
import Link from "next/link";
import { Shield, LayoutDashboard, Users, Box, Wrench, Calendar, ClipboardCheck, Settings, Bell, Search, LogOut } from "lucide-react";
import { AIAssistant } from "@/features/ai/components/ai-assistant";

import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--surface-elevated)] border-r border-[var(--border)] hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[var(--border)]">
          <Link href="/dashboard" className="flex items-center gap-2 text-[var(--primary)] font-bold text-lg">
            <Shield className="w-5 h-5" />
            <span>AssetFlow AI</span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-3 mt-4">Overview</div>
          <NavLink href="/dashboard" icon={<LayoutDashboard size={18} />}>Dashboard</NavLink>
          
          <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-3 mt-6">Core</div>
          <NavLink href="/assets" icon={<Box size={18} />}>Assets</NavLink>
          <NavLink href="/allocations" icon={<Users size={18} />}>Allocations</NavLink>
          
          <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-3 mt-6">Workflows</div>
          <NavLink href="/maintenance" icon={<Wrench size={18} />}>Maintenance</NavLink>
          <NavLink href="/bookings" icon={<Calendar size={18} />}>Bookings</NavLink>
          <NavLink href="/audits" icon={<ClipboardCheck size={18} />}>Audits</NavLink>
          
          <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-3 mt-6">Administration</div>
          <NavLink href="/organization" icon={<Settings size={18} />}>Organization</NavLink>
        </nav>
        
        <div className="p-4 border-t border-[var(--border)]">
          <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-md transition-colors">
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile menu button could go here */}
            
            {/* Global Search */}
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input 
                type="text" 
                placeholder="Search assets, users, or press Ctrl+K..." 
                className="w-full pl-9 pr-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)]"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background)] rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--danger)] rounded-full border border-[var(--surface)]"></span>
            </button>
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
    </div>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: ReactNode; children: ReactNode }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] rounded-md transition-colors"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
