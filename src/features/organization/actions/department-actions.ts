"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { DepartmentValues } from "../validators/org-schemas";

export async function createDepartment(values: DepartmentValues) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("departments")
    .insert([{
      name: values.name,
      code: values.code,
      description: values.description,
      head_id: values.head_id,
      parent_id: values.parent_id,
    }])
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/organization");
  return { data };
}

export async function getDepartments() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("departments")
    .select("*, head:profiles(full_name)")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data as any[];
}
