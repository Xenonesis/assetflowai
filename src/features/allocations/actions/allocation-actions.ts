"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAllocations() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("allocations")
    .select(`
      *,
      asset:assets(id, name, asset_tag),
      recipient:profiles!allocated_to(full_name),
      assigner:profiles!allocated_by(full_name)
    `)
    .order("allocated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as any[];
}

export async function returnAsset(allocationId: string, assetId: string, condition: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // 1. Update allocation record
  const { error: allocError } = await supabase
    .from("allocations")
    .update({
      returned_at: new Date().toISOString(),
      condition_on_return: condition
    })
    .eq("id", allocationId);

  if (allocError) return { error: allocError.message };

  // 2. Update asset status
  const { error: assetError } = await supabase
    .from("assets")
    .update({
      status: "available",
      current_holder_id: null,
      condition: condition
    })
    .eq("id", assetId);

  if (assetError) return { error: assetError.message };

  // 3. Log activity
  await supabase.from("activity_logs").insert([{
    user_id: user.id,
    action: "RETURNED",
    entity_type: "asset",
    entity_id: assetId,
    metadata: { allocation_id: allocationId }
  }]);

  revalidatePath("/allocations");
  revalidatePath("/assets");
  return { success: true };
}
