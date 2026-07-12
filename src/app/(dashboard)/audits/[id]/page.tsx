import { getAuditItems } from "@/features/audits/actions/audit-actions";
import { createClient } from "@/lib/supabase/server";
import { AuditSheet } from "./audit-sheet";
import Link from "next/link";

export default async function AuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = await getAuditItems(id);
  
  interface AuditCycle {
    id: string;
    name: string;
    start_date: string;
    end_date: string | null;
    status: string;
    creator?: { full_name: string } | null;
  }

  const supabase = await createClient();
  const { data: cycle } = (await supabase
    .from("audit_cycles")
    .select("*, creator:profiles!started_by(full_name)")
    .eq("id", id)
    .single()) as unknown as { data: AuditCycle | null };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <Link href="/audits" className="hover:text-[var(--text-primary)] transition-colors">Audits</Link>
        <span>/</span>
        <span className="text-[var(--text-primary)]">Audit Cycle Sheet</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{cycle?.name || 'Audit Sheet'}</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Started by {cycle?.creator?.full_name || 'System'} on {cycle ? new Date(cycle.start_date).toLocaleDateString() : '-'}
          </p>
        </div>
      </div>

      <AuditSheet initialItems={items || []} cycleId={id} cycleStatus={cycle?.status || 'draft'} />
    </div>
  );
}
