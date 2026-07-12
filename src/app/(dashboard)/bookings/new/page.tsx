import { BookingForm } from "@/features/bookings/components/booking-form";

export default function NewBookingPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <span>Bookings</span>
        <span>/</span>
        <span className="text-[var(--text-primary)]">New Booking</span>
      </div>
      
      <BookingForm />
    </div>
  );
}
