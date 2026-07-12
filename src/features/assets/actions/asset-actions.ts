"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { AssetValues, AllocationValues } from "../validators/asset-schemas";
import { Asset } from "../types";

function sanitizeAssetValues(values: Partial<AssetValues>) {
  const sanitized = { ...values };
  if (sanitized.purchase_date === "") sanitized.purchase_date = null as any;
  if (sanitized.warranty_expiry === "") sanitized.warranty_expiry = null as any;
  if (sanitized.serial_number === "") sanitized.serial_number = null as any;
  if (sanitized.location === "") sanitized.location = null as any;
  if (sanitized.notes === "") sanitized.notes = null as any;
  return sanitized;
}

export async function createAsset(values: AssetValues) {
  const supabase = await createClient();
  
  // Need to get current user to set created_by
  const { data: { user } } = await supabase.auth.getUser();

  const sanitizedValues = sanitizeAssetValues(values);

  const { data, error } = await supabase
    .from("assets")
    .insert([{
      ...sanitizedValues,
      created_by: user?.id,
    }])
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }
  
  // Log activity
  if (user && data) {
    await supabase.from("activity_logs").insert([{
      user_id: user.id,
      action: "CREATED",
      entity_type: "asset",
      entity_id: (data as any).id,
      metadata: { name: (data as any).name, asset_tag: (data as any).asset_tag }
    }]);
  }

  revalidatePath("/assets");
  return { data };
}

export async function getAssets() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("assets")
    .select(`
      *,
      department:departments(name),
      category:categories(name),
      holder:profiles!current_holder_id(full_name)
    `)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as unknown as Asset[];
}

export async function allocateAsset(values: AllocationValues) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Not authenticated" };

  // 1. Create allocation record
  const sanitizedValues = {
    ...values,
    expected_return: values.expected_return === "" ? null : values.expected_return,
  };

  const { data: allocation, error: allocError } = await supabase
    .from("allocations")
    .insert([{
      ...sanitizedValues,
      allocated_by: user.id,
    }])
    .select()
    .single();

  if (allocError) return { error: allocError.message };

  // 2. Update asset status and holder
  const { error: updateError } = await supabase
    .from("assets")
    .update({ 
      status: "allocated", 
      current_holder_id: values.allocated_to,
      condition: values.condition_on_allocation
    })
    .eq("id", values.asset_id);

  if (updateError) return { error: updateError.message };
  
  // 3. Log activity
  await supabase.from("activity_logs").insert([{
    user_id: user.id,
    action: "ALLOCATED",
    entity_type: "asset",
    entity_id: values.asset_id,
    metadata: { allocated_to: values.allocated_to }
  }]);

  revalidatePath("/assets");
  revalidatePath(`/assets/${values.asset_id}`);
  return { data: allocation };
}

export async function getAsset(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("assets")
    .select(`
      *,
      department:departments(id, name),
      category:categories(id, name)
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as unknown as Asset;
}

export async function updateAsset(id: string, values: Partial<AssetValues>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const sanitizedValues = sanitizeAssetValues(values);

  const { data, error } = await supabase
    .from("assets")
    .update(sanitizedValues)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  if (user && data) {
    await supabase.from("activity_logs").insert([{
      user_id: user.id,
      action: "UPDATED",
      entity_type: "asset",
      entity_id: id,
      metadata: { name: (data as any).name }
    }]);
  }

  revalidatePath("/assets");
  revalidatePath(`/assets/${id}`);
  return { data: data as unknown as Asset };
}
