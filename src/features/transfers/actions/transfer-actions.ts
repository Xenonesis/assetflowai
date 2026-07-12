"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getTransfers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transfers")
    .select(`
      *,
      asset:assets(name, asset_tag),
      sender:profiles!from_user_id(full_name),
      recipient:profiles!to_user_id(full_name),
      requester:profiles!requested_by(full_name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as any[];
}

export async function createTransfer(values: { asset_id: string; to_user_id: string; remarks?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // 1. Get asset details to find current holder
  const { data: asset, error: assetError } = await supabase
    .from("assets")
    .select("current_holder_id")
    .eq("id", values.asset_id)
    .single();

  if (assetError) return { error: assetError.message };
  if (!asset.current_holder_id) return { error: "This asset is not allocated to anyone, cannot transfer." };

  // 2. Create transfer record
  const { data: transfer, error: transferError } = await supabase
    .from("transfers")
    .insert([{
      asset_id: values.asset_id,
      from_user_id: asset.current_holder_id,
      to_user_id: values.to_user_id,
      status: "pending",
      requested_by: user.id,
      remarks: values.remarks || null
    }])
    .select()
    .single();

  if (transferError) return { error: transferError.message };

  revalidatePath("/transfers");
  return { data: transfer };
}

export async function approveTransfer(transferId: string, assetId: string, toUserId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // 1. Update transfer status
  const { error: transferError } = await supabase
    .from("transfers")
    .update({
      status: "approved",
      approved_by: user.id
    })
    .eq("id", transferId);

  if (transferError) return { error: transferError.message };

  // 2. Update asset holder
  const { error: assetError } = await supabase
    .from("assets")
    .update({ current_holder_id: toUserId })
    .eq("id", assetId);

  if (assetError) return { error: assetError.message };

  // 3. Log activity
  await supabase.from("activity_logs").insert([{
    user_id: user.id,
    action: "TRANSFERRED",
    entity_type: "asset",
    entity_id: assetId,
    metadata: { transfer_id: transferId, to_user_id: toUserId }
  }]);

  revalidatePath("/transfers");
  revalidatePath("/assets");
  return { success: true };
}

export async function rejectTransfer(transferId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("transfers")
    .update({ status: "rejected" })
    .eq("id", transferId);

  if (error) return { error: error.message };

  revalidatePath("/transfers");
  return { success: true };
}
