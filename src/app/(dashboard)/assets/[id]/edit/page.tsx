import { getAsset } from "@/features/assets/actions/asset-actions";
import { AssetForm } from "@/features/assets/components/asset-form";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function EditAssetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let asset = null;
  try {
    asset = await getAsset(id);
  } catch (e) {
    // Handled below
  }

  if (!asset) {
    return (
      <div className="p-8 text-center space-y-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
        <ShieldAlert className="w-12 h-12 text-[var(--danger)] mx-auto" />
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Asset not found</h2>
        <Link href="/assets">
          <Button variant="outline" className="border-[var(--border)] text-[var(--text-primary)]">
            Back to Assets
          </Button>
        </Link>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: departments } = await supabase.from("departments").select("id, name").order("name", { ascending: true });
  const { data: categories } = await supabase.from("categories").select("id, name").order("name", { ascending: true });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <Link href="/assets" className="hover:text-[var(--text-primary)] transition-colors">Assets</Link>
        <span>/</span>
        <Link href={`/assets/${id}`} className="hover:text-[var(--text-primary)] transition-colors">{asset.name}</Link>
        <span>/</span>
        <span className="text-[var(--text-primary)]">Edit</span>
      </div>

      <AssetForm initialData={asset} departments={departments || []} categories={categories || []} />
    </div>
  );
}
