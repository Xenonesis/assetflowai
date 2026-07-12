import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronRight, Wrench, User, Box, Clock, AlertTriangle } from "lucide-react";

export default async function MaintenanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: request } = (await supabase
    .from("maintenance_requests")
    .select(`
      *,
      asset:assets(id, name, asset_tag, condition),
      requester:profiles!requested_by(id, full_name, email),
      assignee:profiles!assigned_to(id, full_name, email)
    `)
    .eq("id", id)
    .single()) as any;

  if (!request) {
    return (
      <div className="p-8 text-center text-[var(--text-secondary)]">
        Maintenance request not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <Link href="/maintenance" className="hover:text-[var(--text-primary)] transition-colors">Maintenance</Link>
        <ChevronRight size={14} />
        <span className="text-[var(--text-primary)]">Request Details</span>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[var(--border)] bg-[var(--background)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[var(--text-primary)]">Maintenance Request</h1>
              <p className="text-xs text-[var(--text-secondary)]">ID: {request.id}</p>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 text-xs rounded-full border ${
            request.status === "completed"
              ? "bg-green-500/10 border-green-500/20 text-green-500"
              : request.status === "pending"
              ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
              : "bg-blue-500/10 border-blue-500/20 text-blue-500"
          } capitalize`}>
            {request.status}
          </span>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Asset details */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Affected Asset</h3>
              <div className="p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg">
                <Link href={`/assets/${request.asset?.id}`} className="font-medium text-[var(--text-primary)] hover:underline text-sm block">
                  {request.asset?.name || "Asset"}
                </Link>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 uppercase tracking-wider">{request.asset?.asset_tag}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-1.5 py-0.5 text-[10px] rounded bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)] capitalize">
                    Condition: {request.asset?.condition}
                  </span>
                </div>
              </div>
            </div>

            {/* Requester details */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Reported By</h3>
              <div className="p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0">
                  <User size={14} />
                </div>
                <div>
                  <Link href={`/organization/employees/${request.requester?.id}`} className="text-sm font-medium text-[var(--text-primary)] hover:underline block">
                    {request.requester?.full_name}
                  </Link>
                  <p className="text-xs text-[var(--text-secondary)]">{request.requester?.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-6 space-y-4">
            {/* Priority & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[var(--text-muted)] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Priority</h4>
                  <span className={`px-2 py-0.5 text-xs rounded border inline-block mt-1 uppercase font-semibold ${
                    request.priority === "critical"
                      ? "bg-red-500/10 border-red-500/20 text-red-500"
                      : request.priority === "high"
                      ? "bg-orange-500/10 border-orange-500/20 text-orange-500"
                      : "bg-blue-500/10 border-blue-500/20 text-blue-500"
                  }`}>
                    {request.priority}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[var(--text-muted)] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Date Logged</h4>
                  <p className="text-sm text-[var(--text-primary)] mt-1">
                    {new Date(request.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-[var(--border)] pt-4">
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Issue Description</h4>
              <p className="text-sm text-[var(--text-primary)] mt-1 whitespace-pre-wrap">
                {request.description}
              </p>
            </div>

            {/* Assignee */}
            <div className="border-t border-[var(--border)] pt-4 space-y-2">
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Assigned Technician</h4>
              {request.assignee ? (
                <div className="flex items-center gap-2 p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg max-w-sm">
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                    <User size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{request.assignee.full_name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{request.assignee.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[var(--text-secondary)]">Not assigned yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
