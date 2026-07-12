"use client";

import { useState } from "react";
import { returnAsset } from "@/features/allocations/actions/allocation-actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ReturnButton({ allocationId, assetId }: { allocationId: string; assetId: string }) {
  const [loading, setLoading] = useState(false);

  const handleReturn = async () => {
    if (!confirm("Are you sure you want to mark this asset as returned?")) return;
    setLoading(true);
    try {
      const res = await returnAsset(allocationId, assetId, "good");
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Asset marked as returned!");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to return asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleReturn}
      disabled={loading}
      className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]"
    >
      {loading && <Loader2 className="w-3 h-3 animate-spin mr-1.5" />}
      Return
    </Button>
  );
}
