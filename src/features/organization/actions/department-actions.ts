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

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  head_id?: string | null;
  parent_id?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  head?: { full_name: string } | null;
}

export async function getDepartments() {
  const supabase = await createClient();

  const { data, error } = (await supabase
    .from("departments")
    .select("*, head:profiles(full_name)")
    .order("name")) as unknown as { data: Department[] | null; error: any };

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}
