import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { User, Mail, ShieldAlert, ChevronRight, Box, Calendar, ArrowLeftRight } from "lucide-react";

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch employee details
  const { data: employee } = (await supabase
    .from("profiles")
    .select("*, department:departments(id, name)")
    .eq("id", id)
    .single()) as any;

  if (!employee) {
    return (
      <div className="p-8 text-center text-[var(--text-secondary)]">
        Employee not found.
      </div>
    );
  }

  // Fetch assets currently held by employee
  const { data: assets } = (await supabase
    .from("assets")
    .select("*, category:categories(name)")
    .eq("current_holder_id", id)
    .is("deleted_at", null)) as any;

  // Fetch bookings by employee
  const { data: bookings } = (await supabase
    .from("bookings")
    .select("*, asset:assets(name, asset_tag)")
    .eq("booked_by", id)
    .order("start_time", { ascending: false })) as any;

  // Fetch transfers involving employee
  const { data: transfers } = (await supabase
    .from("transfers")
    .select(`
      *,
      asset:assets(name, asset_tag),
      sender:profiles!from_user_id(full_name),
      recipient:profiles!to_user_id(full_name)
    `)
    .or(`from_user_id.eq.${id},to_user_id.eq.${id}`)
    .order("created_at", { ascending: false })) as any;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <Link href="/organization" className="hover:text-[var(--text-primary)] transition-colors">Organization</Link>
        <ChevronRight size={14} />
        <span>Employees</span>
        <ChevronRight size={14} />
        <span className="text-[var(--text-primary)]">{employee.full_name}</span>
      </div>

      {/* Header Info */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 flex flex-col md:flex-row justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{employee.full_name}</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1 flex items-center gap-1">
              <Mail className="w-4 h-4 text-[var(--text-muted)]" />
              {employee.email}
            </p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs rounded border border-[var(--border)] capitalize bg-[var(--background)] text-[var(--text-secondary)]">
                ID: {employee.employee_id || "N/A"}
              </span>
              <span className="px-2.5 py-0.5 text-xs rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)] capitalize font-medium">
                {employee.role.replace("_", " ")}
              </span>
              {employee.department && (
                <span className="px-2.5 py-0.5 text-xs rounded border border-[var(--border)] bg-[var(--background)] text-[var(--text-secondary)]">
                  Dept: {employee.department.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocated Assets */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col lg:col-span-1">
          <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--background)] flex items-center gap-2">
            <Box size={16} className="text-blue-500" />
            <h3 className="font-semibold text-[var(--text-primary)]">Assigned Assets ({assets?.length || 0})</h3>
          </div>
          <div className="flex-1 overflow-auto max-h-[350px]">
            {assets && assets.length > 0 ? (
              <div className="divide-y divide-[var(--border)]">
                {assets.map((asset: any) => (
                  <Link 
                    href={`/assets/${asset.id}`} 
                    key={asset.id} 
                    className="px-6 py-4 block hover:bg-[var(--background)] transition-colors"
                  >
                    <p className="font-medium text-[var(--text-primary)] text-sm">{asset.name}</p>
                    <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-0.5">{asset.asset_tag} • {asset.category?.name || "Uncategorized"}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-[var(--text-secondary)]">
                No assets currently assigned.
              </div>
            )}
          </div>
        </div>

        {/* Bookings */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col lg:col-span-1">
          <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--background)] flex items-center gap-2">
            <Calendar size={16} className="text-purple-500" />
            <h3 className="font-semibold text-[var(--text-primary)]">Recent Bookings ({bookings?.length || 0})</h3>
          </div>
          <div className="flex-1 overflow-auto max-h-[350px]">
            {bookings && bookings.length > 0 ? (
              <div className="divide-y divide-[var(--border)]">
                {bookings.map((booking: any) => (
                  <div key={booking.id} className="px-6 py-4">
                    <p className="font-medium text-[var(--text-primary)] text-sm">{booking.asset?.name || "Shared Resource"}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {new Date(booking.start_time).toLocaleString()} - {new Date(booking.end_time).toLocaleString()}
                    </p>
                    {booking.purpose && (
                      <p className="text-xs text-[var(--text-muted)] mt-1 italic">&quot;{booking.purpose}&quot;</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-[var(--text-secondary)]">
                No bookings found.
              </div>
            )}
          </div>
        </div>

        {/* Transfers */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col lg:col-span-1">
          <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--background)] flex items-center gap-2">
            <ArrowLeftRight size={16} className="text-yellow-500" />
            <h3 className="font-semibold text-[var(--text-primary)]">Transfer Logs ({transfers?.length || 0})</h3>
          </div>
          <div className="flex-1 overflow-auto max-h-[350px]">
            {transfers && transfers.length > 0 ? (
              <div className="divide-y divide-[var(--border)]">
                {transfers.map((tx: any) => {
                  const isSender = tx.from_user_id === id;
                  return (
                    <div key={tx.id} className="px-6 py-4">
                      <p className="font-medium text-[var(--text-primary)] text-sm">{tx.asset?.name || "Asset"}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {isSender ? "Sent to " + tx.recipient?.full_name : "Received from " + tx.sender?.full_name}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-[var(--text-muted)]">{new Date(tx.created_at).toLocaleDateString()}</span>
                        <span className={`px-2 py-0.5 text-[10px] rounded-full border ${
                          tx.status === "approved"
                            ? "bg-green-500/10 border-green-500/20 text-green-500"
                            : tx.status === "pending"
                            ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
                            : "bg-red-500/10 border-red-500/20 text-red-500"
                        } capitalize`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-[var(--text-secondary)]">
                No transfers found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
