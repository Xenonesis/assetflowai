import { AllocationForm } from "@/features/allocations/components/allocation-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewAllocationPage() {
  const supabase = await createClient();

  // Fetch available assets
  const { data: assets } = await supabase
    .from("assets")
    .select("id, name, asset_tag")
    .eq("status", "available")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  // Fetch active profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("is_active", true)
    .order("full_name", { ascending: true });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <span className="font-medium">Allocations</span>
        <span>/</span>
        <span className="text-[var(--text-primary)]">New Assignment</span>
      </div>

      <AllocationForm assets={assets || []} profiles={profiles || []} />
    </div>
  );
}
