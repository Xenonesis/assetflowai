import { getAllocations } from "@/features/allocations/actions/allocation-actions";
import Link from "next/link";
import { Plus, Search, User, Calendar, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReturnButton } from "./return-button";

export default async function AllocationsPage() {
  const allocations = await getAllocations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Asset Allocations</h1>
          <p className="text-sm text-[var(--text-secondary)]">Track asset custody and assignment logs.</p>
        </div>
        <Link href="/allocations/new">
          <Button className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]">
            <Plus className="w-4 h-4 mr-2" />
            New Allocation
          </Button>
        </Link>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--background)] text-[var(--text-secondary)] uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Asset</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Assigned To</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Assigned By</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Allocation Date</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Expected Return</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Status</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {allocations && allocations.length > 0 ? (
                allocations.map((alloc) => (
                  <tr key={alloc.id} className="hover:bg-[var(--background)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--text-primary)]">{alloc.asset?.name || 'Unknown Asset'}</div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">{alloc.asset?.asset_tag || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[var(--text-muted)]" />
                        <span>{alloc.recipient?.full_name || 'Unknown Recipient'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      <span>{alloc.assigner?.full_name || 'System'}</span>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      {new Date(alloc.allocated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      {alloc.expected_return ? new Date(alloc.expected_return).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {alloc.returned_at ? (
                        <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-[var(--text-muted)]/10 text-[var(--text-secondary)]">
                          Returned
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-[var(--success)]/10 text-[var(--success)]">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!alloc.returned_at && (
                        <ReturnButton allocationId={alloc.id} assetId={alloc.asset_id} />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                    No allocation logs found. Start by allocating an asset.
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
