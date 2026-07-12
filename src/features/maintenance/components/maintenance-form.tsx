"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { maintenanceRequestSchema, MaintenanceRequestValues } from "../validators/maintenance-schemas";
import { createMaintenanceRequest } from "../actions/maintenance-actions";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export function MaintenanceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultAssetId = searchParams.get("asset_id") || "";
  
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<MaintenanceRequestValues>({
    resolver: zodResolver(maintenanceRequestSchema) as any,
    defaultValues: {
      asset_id: defaultAssetId,
      priority: "medium",
      description: "",
    },
  });

  async function onSubmit(values: MaintenanceRequestValues) {
    setError(null);
    const result = await createMaintenanceRequest(values);
    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/maintenance");
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
      <div className="space-y-2 mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">New Maintenance Request</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Report an issue or request maintenance for an asset.
        </p>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-[var(--danger)] bg-[var(--danger)]/10 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asset_id" className="text-[var(--text-primary)]">Asset ID (UUID for MVP)</Label>
            <Input
              id="asset_id"
              placeholder="UUID of the asset"
              {...form.register("asset_id")}
              className="border-[var(--border)] focus:ring-[var(--primary)]"
            />
            {form.formState.errors.asset_id && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.asset_id.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-[var(--text-primary)]">Priority</Label>
            <select
              id="priority"
              {...form.register("priority")}
              className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)]"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[var(--text-primary)]">Issue Description</Label>
            <textarea
              id="description"
              rows={4}
              placeholder="Describe the issue in detail..."
              {...form.register("description")}
              className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)] resize-y"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.description.message}</p>
            )}
          </div>
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
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </div>
  );
}
