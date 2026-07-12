"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { EmployeeValues } from "../validators/org-schemas";

export interface EmployeeProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  role: "employee" | "asset_manager" | "department_head" | "admin";
  department_id?: string | null;
  employee_id?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  department?: { name: string } | null;
}

export async function createEmployee(values: EmployeeValues) {
  const supabase = await createClient();

  // Generate a random UUID for the profile (since it's a new employee)
  const profileId = crypto.randomUUID();

  const { data, error } = await supabase
    .from("profiles")
    .insert([{
      id: profileId,
      email: values.email,
      full_name: values.full_name,
      role: values.role,
      department_id: values.department_id || null,
      employee_id: values.employee_id,
      is_active: true,
    }])
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/organization");
  return { data };
}

export async function getEmployees() {
  const supabase = await createClient();

  const { data, error } = (await supabase
    .from("profiles")
    .select(`
      *,
      department:departments(name)
    `)
    .order("full_name")) as unknown as { data: EmployeeProfile[] | null; error: any };

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getEmployee(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      *,
      department:departments(id, name)
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as unknown as EmployeeProfile;
}
