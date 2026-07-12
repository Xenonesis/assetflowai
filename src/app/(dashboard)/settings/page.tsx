import { createClient } from "@/lib/supabase/server";
import { User, Shield, Building2, ThemeToggleCard } from "./settings-client";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string | null;
    role: string;
    employee_id?: string | null;
    department_id?: string | null;
    department?: { name: string } | null;
  }

  const { data: profile } = (await supabase
    .from("profiles")
    .select(`
      *,
      department:departments(name)
    `)
    .eq("id", user.id)
    .single()) as unknown as { data: UserProfile | null };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">User & Workspace Settings</h1>
        <p className="text-sm text-[var(--text-secondary)]">Manage your personal profile, department status, and account settings.</p>
      </div>

      <div className="space-y-6">
        
        {/* Profile Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--border)] pb-2">
            <User className="w-4 h-4 text-[var(--primary)]" />
            Personal Profile Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-[var(--text-secondary)] block">Full Name</span>
              <span className="font-semibold text-[var(--text-primary)]">{profile?.full_name || "-"}</span>
            </div>
            <div>
              <span className="text-xs text-[var(--text-secondary)] block">Email Address</span>
              <span className="font-semibold text-[var(--text-primary)]">{profile?.email || "-"}</span>
            </div>
            <div>
              <span className="text-xs text-[var(--text-secondary)] block">Employee ID</span>
              <span className="font-semibold text-[var(--text-primary)]">{profile?.employee_id || "-"}</span>
            </div>
            <div>
              <span className="text-xs text-[var(--text-secondary)] block">System Role</span>
              <span className="font-semibold text-[var(--text-primary)] capitalize">{profile?.role || "employee"}</span>
            </div>
          </div>
        </div>

        {/* Department Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--border)] pb-2">
            <Building2 className="w-4 h-4 text-violet-500" />
            Workspace Custody & Department
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-[var(--text-secondary)] block">Assigned Department</span>
              <span className="font-semibold text-[var(--text-primary)]">{profile?.department?.name || "Unassigned"}</span>
            </div>
            <div>
              <span className="text-xs text-[var(--text-secondary)] block">Security Status</span>
              <span className="font-semibold text-[var(--text-primary)] text-emerald-500">Active Directory Logged</span>
            </div>
          </div>
        </div>

        {/* Preferences Toggle Card */}
        <ThemeToggleCard />

      </div>
    </div>
  );
}
