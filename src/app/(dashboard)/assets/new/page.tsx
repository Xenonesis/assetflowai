import { AssetForm } from "@/features/assets/components/asset-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewAssetPage() {
  const supabase = await createClient();

  // Fetch departments and categories for dropdown selection
  const { data: departments } = await supabase.from("departments").select("id, name").order("name", { ascending: true });
  const { data: categories } = await supabase.from("categories").select("id, name").order("name", { ascending: true });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <span>Assets</span>
        <span>/</span>
        <span className="text-[var(--text-primary)]">Register New</span>
      </div>
      
      <AssetForm departments={departments || []} categories={categories || []} />
    </div>
  );
}
