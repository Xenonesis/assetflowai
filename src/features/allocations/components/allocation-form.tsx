"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { allocationSchema, AllocationValues } from "@/features/assets/validators/asset-schemas";
import { allocateAsset } from "@/features/assets/actions/asset-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export function AllocationForm({ assets = [], profiles = [] }: { assets?: any[], profiles?: any[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AllocationValues>({
    resolver: zodResolver(allocationSchema) as any,
    defaultValues: {
      asset_id: assets[0]?.id || "",
      allocated_to: profiles[0]?.id || "",
      expected_return: "",
      condition_on_allocation: "good",
    },
  });

  async function onSubmit(values: AllocationValues) {
    setError(null);
    const result = await allocateAsset(values);
    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/allocations");
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
      <div className="space-y-2 mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">Allocate Asset</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Assign an available physical asset to an employee.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-[var(--danger)] bg-[var(--danger)]/10 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="asset_id" className="text-[var(--text-primary)]">Select Asset</Label>
            <select
              id="asset_id"
              {...form.register("asset_id")}
              className="w-full h-10 px-3 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)]"
            >
              {assets.length === 0 ? (
                <option value="">No assets available</option>
              ) : (
                assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.asset_tag})
                  </option>
                ))
              )}
            </select>
            {form.formState.errors.asset_id && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.asset_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="allocated_to" className="text-[var(--text-primary)]">Assign to Employee</Label>
            <select
              id="allocated_to"
              {...form.register("allocated_to")}
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
            {form.formState.errors.allocated_to && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.allocated_to.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected_return" className="text-[var(--text-primary)]">Expected Return Date</Label>
            <input
              type="date"
              id="expected_return"
              {...form.register("expected_return")}
              className="w-full h-10 px-3 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition_on_allocation" className="text-[var(--text-primary)]">Condition on Allocation</Label>
            <select
              id="condition_on_allocation"
              {...form.register("condition_on_allocation")}
              className="w-full h-10 px-3 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)] capitalize"
            >
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
              <option value="damaged">Damaged</option>
            </select>
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
            disabled={form.formState.isSubmitting || assets.length === 0}
          >
            {form.formState.isSubmitting ? "Allocating..." : "Allocate Asset"}
          </Button>
        </div>
      </form>
    </div>
  );
}
