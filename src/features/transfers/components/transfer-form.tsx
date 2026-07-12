"use client";

import { useState } from "react";
import { createTransfer } from "@/features/transfers/actions/transfer-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function TransferForm({ assets = [], profiles = [] }: { assets: any[]; profiles: any[] }) {
  const [assetId, setAssetId] = useState(assets[0]?.id || "");
  const [toUserId, setToUserId] = useState(profiles[0]?.id || "");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetId || !toUserId) return;

    setLoading(true);
    setError(null);
    try {
      const res = await createTransfer({ asset_id: assetId, to_user_id: toUserId, remarks });
      if (res.error) {
        setError(res.error);
      } else {
        toast.success("Transfer request submitted successfully!");
        router.push("/transfers");
        router.refresh();
      }
    } catch (e: any) {
      setError(e.message || "Failed to create transfer request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
      <div className="space-y-2 mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">Request Custody Transfer</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Submit a request to transfer custody of an allocated asset to another employee.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-[var(--danger)] bg-[var(--danger)]/10 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="asset_id" className="text-[var(--text-primary)]">Select Allocated Asset</Label>
            <select
              id="asset_id"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="w-full h-10 px-3 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)]"
            >
              {assets.length === 0 ? (
                <option value="">No assets currently allocated</option>
              ) : (
                assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.asset_tag}) - Held by {asset.holder?.full_name || 'Unknown'}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to_user_id" className="text-[var(--text-primary)]">Transfer Custody To</Label>
            <select
              id="to_user_id"
              value={toUserId}
              onChange={(e) => setToUserId(e.target.value)}
              className="w-full h-10 px-3 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)]"
            >
              {profiles.length === 0 ? (
                <option value="">No profiles found</option>
              ) : (
                profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.full_name} ({profile.email})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="remarks" className="text-[var(--text-primary)]">Remarks / Reason (Optional)</Label>
          <textarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. Asset required by engineering head for high priority testing."
            rows={3}
            className="w-full p-3 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)] resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--background)]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors"
            disabled={loading || assets.length === 0}
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
            Request Transfer
          </Button>
        </div>
      </form>
    </div>
  );
}
