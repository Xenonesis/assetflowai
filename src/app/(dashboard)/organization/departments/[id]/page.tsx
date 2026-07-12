import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Building2, Users, Box, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DepartmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: department } = (await supabase
    .from("departments")
    .select("*, head:profiles!head_id(id, full_name, email)")
    .eq("id", id)
    .single()) as any;

  if (!department) {
    return (
      <div className="p-8 text-center text-[var(--text-secondary)]">
        Department not found.
      </div>
    );
  }

  const { data: employees } = (await supabase
    .from("profiles")
    .select("*")
    .eq("department_id", id)) as any;

  const { data: assets } = (await supabase
    .from("assets")
    .select("*, category:categories(name)")
    .eq("department_id", id)
    .is("deleted_at", null)) as any;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <Link href="/organization" className="hover:text-[var(--text-primary)] transition-colors">Organization</Link>
        <ChevronRight size={14} />
        <span>Departments</span>
        <ChevronRight size={14} />
        <span className="text-[var(--text-primary)]">{department.name}</span>
      </div>

      {/* Header Info */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 flex flex-col md:flex-row justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{department.name}</h1>
            <p className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mt-1">{department.code}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-xl">
              {department.description || "No description provided."}
            </p>
          </div>
        </div>
        
        <div className="border-t md:border-t-0 md:border-l border-[var(--border)] pt-4 md:pt-0 md:pl-6 shrink-0 min-w-[200px]">
          <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Department Head</h2>
          {department.head ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                <User size={14} />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{department.head.full_name}</p>
                <p className="text-xs text-[var(--text-secondary)]">{department.head.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-secondary)]">Unassigned</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employees List */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--background)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-blue-500" />
              <h3 className="font-semibold text-[var(--text-primary)]">Employees ({employees?.length || 0})</h3>
            </div>
          </div>
          <div className="flex-1 overflow-auto max-h-[400px]">
            {employees && employees.length > 0 ? (
              <div className="divide-y divide-[var(--border)]">
                {employees.map((emp: any) => (
                  <div key={emp.id} className="px-6 py-4 flex items-center justify-between hover:bg-[var(--background)] transition-colors">
                    <div>
                      <p className="font-medium text-[var(--text-primary)] text-sm">{emp.full_name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{emp.email}</p>
                    </div>
                    <span className="px-2 py-0.5 text-xs rounded bg-[var(--background)] border border-[var(--border)] capitalize text-[var(--text-secondary)]">
                      {emp.role.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-[var(--text-secondary)]">
                No employees assigned to this department.
              </div>
            )}
          </div>
        </div>

        {/* Assets List */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--background)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Box size={16} className="text-purple-500" />
              <h3 className="font-semibold text-[var(--text-primary)]">Assigned Assets ({assets?.length || 0})</h3>
            </div>
          </div>
          <div className="flex-1 overflow-auto max-h-[400px]">
            {assets && assets.length > 0 ? (
              <div className="divide-y divide-[var(--border)]">
                {assets.map((asset: any) => (
                  <Link 
                    href={`/assets/${asset.id}`} 
                    key={asset.id} 
                    className="px-6 py-4 flex items-center justify-between hover:bg-[var(--background)] transition-colors block"
                  >
                    <div>
                      <p className="font-medium text-[var(--text-primary)] text-sm">{asset.name}</p>
                      <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">{asset.asset_tag} • {asset.category?.name || "Uncategorized"}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 text-xs rounded-full border ${
                      asset.status === "available"
                        ? "bg-green-500/10 border-green-500/20 text-green-500"
                        : asset.status === "allocated"
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                        : "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
                    }`}>
                      {asset.status}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-[var(--text-secondary)]">
                No assets currently assigned to this department.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
