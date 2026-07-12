"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { MaintenanceRequestValues } from "../validators/maintenance-schemas";

export async function createMaintenanceRequest(values: MaintenanceRequestValues) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("maintenance_requests")
    .insert([{
      ...values,
      requested_by: user.id,
      status: "pending"
    }])
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Update asset status
  await supabase
    .from("assets")
    .update({ status: "maintenance" })
    .eq("id", values.asset_id);

  // Log activity
  await supabase.from("activity_logs").insert([{
    user_id: user.id,
    action: "MAINTENANCE_REQUESTED",
    entity_type: "asset",
    entity_id: values.asset_id,
    metadata: { priority: values.priority, request_id: (data as any).id }
  }]);

  revalidatePath("/maintenance");
  revalidatePath("/assets");
  return { data };
}

export async function getMaintenanceRequests() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("maintenance_requests")
    .select(`
      *,
      asset:assets(name, asset_tag),
      requester:profiles!requested_by(full_name),
      assignee:profiles!assigned_to(full_name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as any[];
}
