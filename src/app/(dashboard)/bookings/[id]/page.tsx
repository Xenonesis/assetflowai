import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronRight, Calendar, User, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: booking } = (await supabase
    .from("bookings")
    .select(`
      *,
      asset:assets(id, name, asset_tag),
      user:profiles!booked_by(id, full_name, email)
    `)
    .eq("id", id)
    .single()) as any;

  if (!booking) {
    return (
      <div className="p-8 text-center text-[var(--text-secondary)]">
        Booking not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <Link href="/bookings" className="hover:text-[var(--text-primary)] transition-colors">Bookings</Link>
        <ChevronRight size={14} />
        <span className="text-[var(--text-primary)]">Booking Details</span>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[var(--border)] bg-[var(--background)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[var(--text-primary)]">Booking Details</h1>
              <p className="text-xs text-[var(--text-secondary)]">ID: {booking.id}</p>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 text-xs rounded-full border ${
            booking.status === "confirmed"
              ? "bg-green-500/10 border-green-500/20 text-green-500"
              : booking.status === "pending"
              ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
              : "bg-red-500/10 border-red-500/20 text-red-500"
          } capitalize`}>
            {booking.status}
          </span>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resource details */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Booked Resource</h3>
              <div className="p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg">
                <Link href={`/assets/${booking.asset?.id}`} className="font-medium text-[var(--text-primary)] hover:underline text-sm block">
                  {booking.asset?.name || "Shared Resource"}
                </Link>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 uppercase tracking-wider">{booking.asset?.asset_tag}</p>
              </div>
            </div>

            {/* Booked by details */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Booked By</h3>
              <div className="p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0">
                  <User size={14} />
                </div>
                <div>
                  <Link href={`/organization/employees/${booking.user?.id}`} className="text-sm font-medium text-[var(--text-primary)] hover:underline block">
                    {booking.user?.full_name}
                  </Link>
                  <p className="text-xs text-[var(--text-secondary)]">{booking.user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-6 space-y-4">
            {/* Time Slot */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[var(--text-muted)] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Time Slot</h4>
                <div className="text-sm text-[var(--text-primary)] mt-1 space-y-1">
                  <p><span className="text-[var(--text-secondary)] font-medium">Start:</span> {new Date(booking.start_time).toLocaleString()}</p>
                  <p><span className="text-[var(--text-secondary)] font-medium">End:</span> {new Date(booking.end_time).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Purpose */}
            {booking.purpose && (
              <div className="flex items-start gap-3 border-t border-[var(--border)] pt-4">
                <AlertCircle className="w-5 h-5 text-[var(--text-muted)] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Purpose</h4>
                  <p className="text-sm text-[var(--text-primary)] mt-1 whitespace-pre-wrap">
                    {booking.purpose}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
