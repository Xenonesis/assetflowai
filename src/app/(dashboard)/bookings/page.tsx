import { getBookings } from "@/features/bookings/actions/booking-actions";
import Link from "next/link";
import { Plus, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Bookings</h1>
          <p className="text-sm text-[var(--text-secondary)]">Manage resource reservations and availability.</p>
        </div>
        <Link href="/bookings/new">
          <Button className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]">
            <Plus className="w-4 h-4 mr-2" />
            Book Resource
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
          <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-2">
            <Calendar className="w-4 h-4" />
            <h3 className="text-sm font-medium">Active Bookings</h3>
          </div>
          <p className="text-3xl font-semibold text-[var(--text-primary)]">{bookings?.length || 0}</p>
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--background)] text-[var(--text-secondary)] uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Resource</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Booked By</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Start Time</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">End Time</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {bookings && bookings.length > 0 ? (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[var(--background)] transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/bookings/${b.id}`} className="hover:underline block">
                        <div className="font-medium text-[var(--text-primary)]">{b.asset?.name || 'Unknown'}</div>
                        <div className="text-xs text-[var(--text-secondary)] mt-0.5">{b.asset?.asset_tag || '-'}</div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      {b.user?.full_name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-[var(--text-primary)]">
                      {new Date(b.start_time).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-[var(--text-primary)]">
                      {new Date(b.end_time).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-medium bg-[var(--success)]/10 text-[var(--success)]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Confirmed
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                    <div className="flex flex-col items-center justify-center">
                      <Calendar className="w-12 h-12 text-[var(--border)] mb-4" />
                      <p>No active bookings found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
