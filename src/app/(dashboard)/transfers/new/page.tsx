import { TransferForm } from "@/features/transfers/components/transfer-form";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function NewTransferPage() {
  const supabase = await createClient();

  // Fetch allocated assets
  const { data: assets } = await supabase
    .from("assets")
    .select("id, name, asset_tag, holder:profiles!current_holder_id(full_name)")
    .eq("status", "allocated")
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
        <Link href="/transfers" className="hover:text-[var(--text-primary)] transition-colors">Transfers</Link>
        <span>/</span>
        <span className="text-[var(--text-primary)]">New Request</span>
      </div>

      <TransferForm assets={assets || []} profiles={profiles || []} />
    </div>
  );
}
