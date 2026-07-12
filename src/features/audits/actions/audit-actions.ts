"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAuditCycles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("audit_cycles")
    .select(`
      *,
      creator:profiles!started_by(full_name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as any[];
}

export async function createAuditCycle(name: string, startDate: string, endDate?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // 1. Create audit cycle
  const { data: cycle, error: cycleError } = (await supabase
    .from("audit_cycles")
    .insert([{
      name,
      start_date: startDate,
      end_date: endDate || null,
      started_by: user.id,
      status: "in_progress"
    }])
    .select()
    .single()) as unknown as { data: { id: string } | null; error: any };

  if (cycleError) return { error: cycleError.message };
  if (!cycle) return { error: "Failed to create audit cycle" };

  // 2. Fetch all active assets (not retired / deleted)
  const { data: assets, error: assetError } = (await supabase
    .from("assets")
    .select("id")
    .is("deleted_at", null)
    .neq("status", "retired")) as unknown as { data: { id: string }[] | null; error: any };

  if (assetError) return { error: assetError.message };

  // 3. Create audit items for each asset
  if (assets && assets.length > 0) {
    const auditItems = assets.map((asset) => ({
      cycle_id: cycle.id,
      asset_id: asset.id,
      status: "pending"
    }));

    const { error: itemsError } = await supabase
      .from("audit_items")
      .insert(auditItems);

    if (itemsError) return { error: itemsError.message };
  }

  revalidatePath("/audits");
  return { data: cycle };
}

export async function getAuditItems(cycleId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("audit_items")
    .select(`
      *,
      asset:assets(id, name, asset_tag, serial_number, status, location),
      verifier:profiles!verified_by(full_name)
    `)
    .eq("cycle_id", cycleId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as any[];
}

export async function verifyAuditItem(
  itemId: string,
  status: string,
  condition: string,
  remarks?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("audit_items")
    .update({
      status,
      condition,
      remarks: remarks || null,
      verified_by: user.id,
      updated_at: new Date().toISOString()
    })
    .eq("id", itemId)
    .select()
    .single();

  if (error) return { error: error.message };

  // Log activity
  await supabase.from("activity_logs").insert([{
    user_id: user.id,
    action: "AUDITED",
    entity_type: "audit_item",
    entity_id: itemId,
    metadata: { status, condition }
  }]);

  return { data };
}

export async function closeAuditCycle(cycleId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("audit_cycles")
    .update({
      status: "completed",
      end_date: new Date().toISOString().split("T")[0]
    })
    .eq("id", cycleId)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/audits");
  return { data };
}
