"use client";

import { useState } from "react";
import { verifyAuditItem, closeAuditCycle } from "@/features/audits/actions/audit-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, ClipboardCheck, AlertTriangle, AlertCircle, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AuditSheet({ 
  initialItems = [], 
  cycleId,
  cycleStatus 
}: { 
  initialItems: any[]; 
  cycleId: string;
  cycleStatus: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [status, setStatus] = useState("verified");
  const [condition, setCondition] = useState("good");
  const [remarks, setRemarks] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [closing, setClosing] = useState(false);
  const router = useRouter();

  const handleSelectItem = (item: any) => {
    if (cycleStatus !== "in_progress") return;
    setSelectedItem(item);
    setStatus(item.status === "pending" ? "verified" : item.status);
    setCondition(item.condition || "good");
    setRemarks(item.remarks || "");
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setVerifying(true);
    try {
      const res = await verifyAuditItem(selectedItem.id, status, condition, remarks);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Asset status verified!");
        // Update local state
        setItems(prev => prev.map(item => 
          item.id === selectedItem.id 
            ? { 
                ...item, 
                status, 
                condition, 
                remarks, 
                verifier: { full_name: "You" },
                updated_at: new Date().toISOString() 
              }
            : item
        ));
        setSelectedItem(null);
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to verify asset");
    } finally {
      setVerifying(false);
    }
  };

  const handleCloseAudit = async () => {
    if (!confirm("Are you sure you want to close this audit cycle? This will lock all verification results.")) return;
    setClosing(true);
    try {
      const res = await closeAuditCycle(cycleId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Audit cycle completed and closed!");
        router.push("/audits");
        router.refresh();
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to close audit cycle");
    } finally {
      setClosing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-emerald-500/10 text-emerald-500";
      case "missing":
        return "bg-yellow-500/10 text-yellow-500";
      case "damaged":
        return "bg-orange-500/10 text-orange-500";
      case "lost":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-[var(--surface-elevated)] text-[var(--text-secondary)]";
    }
  };

  const pendingCount = items.filter(i => i.status === "pending").length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      {/* List Table */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Status Dashboard Header */}
        <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <div className="text-xs text-[var(--text-secondary)] font-medium">Total Assets</div>
              <div className="text-xl font-bold text-[var(--text-primary)]">{items.length}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)] font-medium">Pending Verify</div>
              <div className="text-xl font-bold text-[var(--text-primary)]">{pendingCount}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)] font-medium">Verified</div>
              <div className="text-xl font-bold text-[var(--text-primary)]">{items.length - pendingCount}</div>
            </div>
          </div>
          
          {cycleStatus === "in_progress" && (
            <Button 
              onClick={handleCloseAudit}
              disabled={closing || pendingCount > 0}
              className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] text-xs font-semibold"
              title={pendingCount > 0 ? "All items must be verified to complete the audit" : ""}
            >
              {closing && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
              Complete Audit Cycle
            </Button>
          )}
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--background)] text-[var(--text-secondary)] uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Asset Details</th>
                  <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Barcode/Tag</th>
                  <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Last Location</th>
                  <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Verification</th>
                  <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Verified By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {items.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => handleSelectItem(item)}
                    className={`transition-colors cursor-pointer ${
                      selectedItem?.id === item.id 
                        ? "bg-[var(--primary)]/5" 
                        : "hover:bg-[var(--background)]"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[var(--text-primary)]">{item.asset?.name}</div>
                      <div className="text-xs text-[var(--text-muted)] mt-0.5">S/N: {item.asset?.serial_number || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)] font-mono text-xs">
                      {item.asset?.asset_tag}
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      {item.asset?.location || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-bold capitalize ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)] text-xs">
                      {item.verifier?.full_name || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Verification Sidebar Panel */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
        {selectedItem ? (
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">Verify Asset</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Currently auditing <span className="font-semibold">{selectedItem.asset?.name}</span>
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-[var(--border)]">
              
              {/* Audit Status selection */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-[var(--text-secondary)]">Verification State</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus("verified")}
                    className={`h-9 rounded-md border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      status === "verified"
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                        : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)]"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    Verified
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("missing")}
                    className={`h-9 rounded-md border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      status === "missing"
                        ? "bg-yellow-500/10 border-yellow-500 text-yellow-500"
                        : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)]"
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Missing
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("damaged")}
                    className={`h-9 rounded-md border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      status === "damaged"
                        ? "bg-orange-500/10 border-orange-500 text-orange-500"
                        : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)]"
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Damaged
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("lost")}
                    className={`h-9 rounded-md border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      status === "lost"
                        ? "bg-red-500/10 border-red-500 text-red-500"
                        : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)]"
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Lost
                  </button>
                </div>
              </div>

              {/* Condition Selection */}
              <div className="space-y-2">
                <Label htmlFor="condition" className="text-xs font-semibold text-[var(--text-secondary)]">Condition</Label>
                <select
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full h-10 px-3 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)] capitalize"
                >
                  <option value="new">New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <Label htmlFor="remarks" className="text-xs font-semibold text-[var(--text-secondary)]">Remarks (Optional)</Label>
                <textarea
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Scanned via QR, slight scratches on case."
                  rows={3}
                  className="w-full p-3 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)] resize-none"
                />
              </div>

            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedItem(null)}
                className="h-9 text-xs border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={verifying}
                className="h-9 text-xs bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors"
              >
                {verifying && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
                Confirm Verification
              </Button>
            </div>
          </form>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-center space-y-2 opacity-60">
            <ClipboardCheck className="w-8 h-8 text-[var(--text-muted)]" />
            <div className="text-xs font-semibold text-[var(--text-primary)]">Select an Asset</div>
            <p className="text-[10px] text-[var(--text-secondary)] max-w-[200px]">
              {cycleStatus === "in_progress" 
                ? "Select a row from the verification list to confirm its condition and status."
                : "This audit cycle has been completed. Verification records are locked."
              }
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
