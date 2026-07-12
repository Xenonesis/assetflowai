import { MaintenanceForm } from "@/features/maintenance/components/maintenance-form";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

export default async function NewMaintenancePage() {
  const supabase = await createClient();

  // Fetch active assets for maintenance request
  const { data: assets } = await supabase
    .from("assets")
    .select("id, name, asset_tag")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <span>Maintenance</span>
        <span>/</span>
        <span className="text-[var(--text-primary)]">New Request</span>
      </div>
      
      <Suspense fallback={<div>Loading form...</div>}>
        <MaintenanceForm assets={assets || []} />
      </Suspense>
    </div>
  );
}
