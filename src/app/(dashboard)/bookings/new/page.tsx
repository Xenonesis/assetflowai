import { BookingForm } from "@/features/bookings/components/booking-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewBookingPage() {
  const supabase = await createClient();
  
  // Fetch active assets for booking selection
  const { data: assets } = await supabase
    .from("assets")
    .select("id, name, asset_tag")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <span>Bookings</span>
        <span>/</span>
        <span className="text-[var(--text-primary)]">New Booking</span>
      </div>
      
      <BookingForm assets={assets || []} />
    </div>
  );
}
