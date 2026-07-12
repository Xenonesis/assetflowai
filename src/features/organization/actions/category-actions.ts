"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { CategoryValues } from "../validators/org-schemas";

export async function createCategory(values: CategoryValues) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .insert([{
      name: values.name,
      description: values.description,
      icon: values.icon,
    }])
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/organization");
  return { data };
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  metadata_schema?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export async function getCategories() {
  const supabase = await createClient();

  const { data, error } = (await supabase
    .from("categories")
    .select("*")
    .order("name")) as unknown as { data: Category[] | null; error: any };

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}
