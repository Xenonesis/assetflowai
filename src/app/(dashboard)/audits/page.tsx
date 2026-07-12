import { getAuditCycles } from "@/features/audits/actions/audit-actions";
import Link from "next/link";
import { ClipboardCheck, Plus, Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateAuditModal } from "./create-audit-modal";

export default async function AuditsPage() {
  const cycles = await getAuditCycles();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-[var(--primary)]/10 text-[var(--primary)]";
      case "completed":
        return "bg-[var(--success)]/10 text-[var(--success)]";
      default:
        return "bg-[var(--text-muted)]/10 text-[var(--text-secondary)]";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Inventory Audits</h1>
          <p className="text-sm text-[var(--text-secondary)]">Create and manage asset compliance audit cycles.</p>
        </div>
        <CreateAuditModal />
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--background)] text-[var(--text-secondary)] uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Audit Name</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Started By</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Start Date</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">End Date</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Status</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {cycles && cycles.length > 0 ? (
                cycles.map((cycle) => (
                  <tr key={cycle.id} className="hover:bg-[var(--background)] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--text-primary)]">{cycle.name}</div>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[var(--text-muted)]" />
                        <span>{cycle.creator?.full_name || 'System'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      {new Date(cycle.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      {cycle.end_date ? new Date(cycle.end_date).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-medium capitalize ${getStatusColor(cycle.status)}`}>
                        {cycle.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/audits/${cycle.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]"
                        >
                          {cycle.status === "in_progress" ? "Perform Audit" : "View Results"}
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                    <div className="flex flex-col items-center justify-center space-y-2 opacity-65">
                      <ClipboardCheck className="w-10 h-10 text-[var(--text-muted)]" />
                      <p>No audit cycles active. Start a new audit cycle to verify your inventory.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
