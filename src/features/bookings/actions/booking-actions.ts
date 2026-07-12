"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { BookingValues } from "../validators/booking-schemas";

export async function createBooking(values: BookingValues) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Check for overlap
  const { data: overlaps, error: overlapError } = await supabase
    .from("bookings")
    .select("id")
    .eq("asset_id", values.asset_id)
    .eq("status", "confirmed")
    .or(`and(start_time.lte.${values.end_time},end_time.gte.${values.start_time})`);

  if (overlapError) return { error: overlapError.message };
  
  if (overlaps && overlaps.length > 0) {
    return { error: "This resource is already booked for the selected time slot." };
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert([{
      ...values,
      booked_by: user.id,
      status: "confirmed"
    }])
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/bookings");
  return { data };
}

export async function getBookings() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      asset:assets(name, asset_tag),
      user:profiles!booked_by(full_name)
    `)
    .order("start_time", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as any[];
}
