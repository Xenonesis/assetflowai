"use client";

import { useState } from "react";
import { createAuditCycle } from "@/features/audits/actions/audit-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function CreateAuditModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await createAuditCycle(name, startDate);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Audit cycle started successfully!");
        setIsOpen(false);
        setName("");
        router.refresh();
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to start audit cycle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] font-semibold"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Audit Cycle
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-md shadow-2xl p-6 relative overflow-hidden">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)]"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)] mb-2">Create Audit Cycle</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Start a new inventory audit. This will snapshot all active assets and create verification sheets for them.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="audit_name" className="text-[var(--text-primary)]">Audit Name</Label>
                <input
                  type="text"
                  id="audit_name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Q3 2026 IT Equipment Audit"
                  className="w-full h-10 px-3 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date" className="text-[var(--text-primary)]">Start Date</Label>
                <input
                  type="date"
                  id="start_date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-10 px-3 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--background)]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
                  Start Audit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
