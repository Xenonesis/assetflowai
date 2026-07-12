import { createClient } from "@/lib/supabase/server";
import { History, User, Activity, FileText } from "lucide-react";

interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  user: {
    full_name: string;
    email: string;
  } | null;
}

export default async function ActivityPage() {
  const supabase = await createClient();

  const { data: logs } = (await supabase
    .from("activity_logs")
    .select(`
      *,
      user:profiles!user_id(full_name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(100)) as unknown as { data: ActivityLog[] | null };

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case "CREATED":
        return "text-emerald-500 bg-emerald-500/10";
      case "ALLOCATED":
        return "text-[var(--primary)] bg-[var(--primary)]/10";
      case "RETURNED":
        return "text-indigo-500 bg-indigo-500/10";
      case "AUDITED":
        return "text-violet-500 bg-violet-500/10";
      default:
        return "text-[var(--text-secondary)] bg-[var(--surface-elevated)]";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">System Activity Logs</h1>
        <p className="text-sm text-[var(--text-secondary)]">Prerendered audit trail of actions taken within the system.</p>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--background)] text-[var(--text-secondary)] uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Actor</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Action</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Entity</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Details</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {logs && logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--background)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[var(--text-primary)]">{log.user?.full_name || 'System'}</div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">{log.user?.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-bold uppercase ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)] capitalize font-semibold text-xs">
                      {log.entity_type}
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)] text-xs font-mono max-w-xs truncate">
                      {log.metadata ? JSON.stringify(log.metadata) : "-"}
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)] text-xs">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                    <div className="flex flex-col items-center justify-center space-y-2 opacity-65">
                      <History className="w-10 h-10 text-[var(--text-muted)]" />
                      <p>No activity logs found in the database.</p>
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
