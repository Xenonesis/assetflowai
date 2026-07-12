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

export async function getCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data as any[];
}
