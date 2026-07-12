import { getTransfers } from "@/features/transfers/actions/transfer-actions";
import Link from "next/link";
import { Plus, ArrowRight, User, ShieldAlert, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransferActionButtons } from "./transfer-action-buttons";

export default async function TransfersPage() {
  const transfers = await getTransfers();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-[var(--success)]/10 text-[var(--success)]";
      case "pending":
        return "bg-[var(--primary)]/10 text-[var(--primary)]";
      case "rejected":
        return "bg-[var(--danger)]/10 text-[var(--danger)]";
      default:
        return "bg-[var(--surface-elevated)] text-[var(--text-secondary)]";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Asset Transfers</h1>
          <p className="text-sm text-[var(--text-secondary)]">Manage transfers of custody between employees.</p>
        </div>
        <Link href="/transfers/new">
          <Button className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]">
            <Plus className="w-4 h-4 mr-2" />
            Request Transfer
          </Button>
        </Link>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--background)] text-[var(--text-secondary)] uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Asset</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">From User</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">To User</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Requested By</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Remarks</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Status</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {transfers && transfers.length > 0 ? (
                transfers.map((t) => (
                  <tr key={t.id} className="hover:bg-[var(--background)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[var(--text-primary)]">{t.asset?.name || 'Unknown Asset'}</div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">{t.asset?.asset_tag || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[var(--text-muted)]" />
                        <span>{t.sender?.full_name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[var(--text-muted)]" />
                        <span>{t.recipient?.full_name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      <span>{t.requester?.full_name || '-'}</span>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)] text-xs max-w-xs truncate">
                      {t.remarks || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-bold capitalize ${getStatusColor(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {t.status === "pending" && (
                        <TransferActionButtons 
                          transferId={t.id} 
                          assetId={t.asset_id} 
                          toUserId={t.to_user_id} 
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                    <div className="flex flex-col items-center justify-center space-y-2 opacity-65">
                      <ArrowLeftRight className="w-10 h-10 text-[var(--text-muted)]" />
                      <p>No asset transfer logs found.</p>
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
