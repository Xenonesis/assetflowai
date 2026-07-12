"use client";

import { useState } from "react";
import { approveTransfer, rejectTransfer } from "@/features/transfers/actions/transfer-actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function TransferActionButtons({ 
  transferId, 
  assetId, 
  toUserId 
}: { 
  transferId: string; 
  assetId: string; 
  toUserId: string; 
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await approveTransfer(transferId, assetId, toUserId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Transfer approved!");
        router.refresh();
      }
    } catch (e: any) {
      toast.error("Failed to approve transfer");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      const res = await rejectTransfer(transferId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Transfer request rejected");
        router.refresh();
      }
    } catch (e: any) {
      toast.error("Failed to reject transfer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={handleReject} 
        disabled={loading}
        className="h-8 border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]"
      >
        Reject
      </Button>
      <Button 
        size="sm" 
        onClick={handleApprove} 
        disabled={loading}
        className="h-8 bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] font-semibold"
      >
        {loading && <Loader2 className="w-3 h-3 animate-spin mr-1.5" />}
        Approve
      </Button>
    </div>
  );
}
