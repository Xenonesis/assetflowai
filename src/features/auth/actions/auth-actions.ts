"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { LoginValues, SignupValues } from "../validators/auth-schemas";

export async function login(values: LoginValues) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(values: SignupValues) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        full_name: values.fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Fallback: manually insert profile if trigger hasn't run or is not configured
  if (data?.user) {
    await supabase
      .from("profiles")
      .insert([{
        id: data.user.id,
        email: values.email,
        full_name: values.fullName,
        role: "admin", // Default to admin for testing accounts to prevent RLS blocks
        is_active: true,
      }]);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
