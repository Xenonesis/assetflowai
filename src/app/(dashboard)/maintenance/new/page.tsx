import { MaintenanceForm } from "@/features/maintenance/components/maintenance-form";
import { Suspense } from "react";

export default function NewMaintenancePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <span>Maintenance</span>
        <span>/</span>
        <span className="text-[var(--text-primary)]">New Request</span>
      </div>
      
      <Suspense fallback={<div>Loading form...</div>}>
        <MaintenanceForm />
      </Suspense>
    </div>
  );
}
