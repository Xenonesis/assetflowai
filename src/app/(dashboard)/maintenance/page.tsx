import { getMaintenanceRequests } from "@/features/maintenance/actions/maintenance-actions";
import Link from "next/link";
import { Plus, Wrench, AlertCircle, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function MaintenancePage() {
  const requests = await getMaintenanceRequests();

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'bg-[var(--danger)]/10 text-[var(--danger)]';
      case 'high': return 'bg-orange-500/10 text-orange-500';
      case 'medium': return 'bg-[var(--warning)]/10 text-[var(--warning)]';
      case 'low': return 'bg-[var(--info)]/10 text-[var(--info)]';
      default: return 'bg-[var(--surface-elevated)] text-[var(--text-primary)]';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'resolved':
      case 'closed': return 'bg-[var(--success)]/10 text-[var(--success)]';
      case 'in_progress': return 'bg-[var(--primary)]/10 text-[var(--primary)]';
      case 'pending': return 'bg-[var(--warning)]/10 text-[var(--warning)]';
      case 'rejected': return 'bg-[var(--danger)]/10 text-[var(--danger)]';
      default: return 'bg-[var(--surface-elevated)] text-[var(--text-primary)]';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Maintenance</h1>
          <p className="text-sm text-[var(--text-secondary)]">Manage repairs and maintenance requests.</p>
        </div>
        <Link href="/maintenance/new">
          <Button className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]">
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input 
            type="text" 
            placeholder="Search tickets, assets..." 
            className="w-full pl-9 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)]"
          />
        </div>
        <Button variant="outline" className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface)]">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--background)] text-[var(--text-secondary)] uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Ticket ID</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Asset</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Requester</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Priority</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Status</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Date</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {requests && requests.length > 0 ? (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-[var(--background)] transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-[var(--text-secondary)]">
                      {req.id.split('-')[0]}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/maintenance/${req.id}`} className="hover:underline block">
                        <div className="font-medium text-[var(--text-primary)]">{req.asset?.name || 'Unknown'}</div>
                        <div className="text-xs text-[var(--text-secondary)] mt-0.5">{req.asset?.asset_tag || '-'}</div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      {req.requester?.full_name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-medium capitalize ${getPriorityColor(req.priority)}`}>
                        {req.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-medium capitalize ${getStatusColor(req.status)}`}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/maintenance/${req.id}`}>
                        <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                    <div className="flex flex-col items-center justify-center">
                      <Wrench className="w-12 h-12 text-[var(--border)] mb-4" />
                      <p>No maintenance requests found.</p>
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
