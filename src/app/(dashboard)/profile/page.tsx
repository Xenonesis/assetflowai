import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Mail, Shield, Building, Tag, Box, Calendar, ChevronRight } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profileData } = (await supabase
    .from("profiles")
    .select("*, department:departments(name)")
    .eq("id", user.id)
    .maybeSingle()) as any;

  const profile = profileData || {
    id: user.id,
    full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
    email: user.email || "",
    role: "employee",
    employee_id: "PENDING",
    is_active: true,
    department: null,
  };

  // Fetch assets currently held by the user
  const { data: assets } = (await supabase
    .from("assets")
    .select("*, category:categories(name)")
    .eq("current_holder_id", user.id)
    .is("deleted_at", null)) as any;

  // Fetch recent bookings made by the user
  const { data: bookings } = (await supabase
    .from("bookings")
    .select("*, asset:assets(name, asset_tag)")
    .eq("booked_by", user.id)
    .order("start_time", { ascending: false })
    .limit(10)) as any;

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <Link href="/dashboard" className="hover:text-[var(--text-primary)] transition-colors">Dashboard</Link>
        <ChevronRight size={14} />
        <span className="text-[var(--text-primary)]">My Profile</span>
      </div>

      {/* Main Profile Header Banner */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm">
        <div className="w-24 h-24 rounded-full bg-[var(--primary)]/10 border-2 border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] text-3xl font-bold uppercase shrink-0">
          {getInitials(profile.full_name)}
        </div>
        
        <div className="space-y-3 text-center md:text-left flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 justify-center md:justify-start">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] truncate">{profile.full_name}</h1>
            <span className="px-2.5 py-0.5 text-xs rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)] capitalize font-semibold max-w-max mx-auto md:mx-0">
              {profile.role.replace("_", " ")}
            </span>
          </div>
          
          <p className="text-sm text-[var(--text-secondary)] flex items-center justify-center md:justify-start gap-2">
            <Mail className="w-4 h-4 text-[var(--text-muted)]" />
            {profile.email}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-xs">
            {profile.employee_id && (
              <span className="px-2.5 py-1 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--text-secondary)] font-mono uppercase">
                ID: {profile.employee_id}
              </span>
            )}
            {profile.department && (
              <span className="px-2.5 py-1 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--text-secondary)] flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-sky-500" />
                {profile.department.name}
              </span>
            )}
            <span className={`px-2.5 py-1 rounded border text-xs capitalize ${
              profile.is_active 
                ? "bg-green-500/10 border-green-500/20 text-green-500" 
                : "bg-red-500/10 border-red-500/20 text-red-500"
            }`}>
              {profile.is_active ? "Active Account" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocated Assets Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm flex flex-col lg:col-span-1">
          <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--background)] flex items-center gap-2">
            <Box size={16} className="text-[var(--primary)]" />
            <h3 className="font-semibold text-[var(--text-primary)]">My Assigned Assets ({assets?.length || 0})</h3>
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
              <div className="p-8 text-center text-xs text-[var(--text-secondary)] py-12">
                No assets currently assigned to you.
              </div>
            )}
          </div>
        </div>

        {/* Recent Bookings Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm flex flex-col lg:col-span-2">
          <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--background)] flex items-center gap-2">
            <Calendar size={16} className="text-purple-500" />
            <h3 className="font-semibold text-[var(--text-primary)]">My Recent Bookings ({bookings?.length || 0})</h3>
          </div>
          <div className="flex-1 overflow-auto max-h-[350px]">
            {bookings && bookings.length > 0 ? (
              <div className="divide-y divide-[var(--border)]">
                {bookings.map((booking: any) => (
                  <div key={booking.id} className="px-6 py-4 hover:bg-[var(--background)]/50 transition-colors">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Link href={`/bookings/${booking.id}`} className="font-medium text-[var(--text-primary)] text-sm hover:underline">
                          {booking.asset?.name || "Shared Resource"}
                        </Link>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">Tag: {booking.asset?.asset_tag}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 text-[10px] rounded-full border ${
                        booking.status === "confirmed"
                          ? "bg-green-500/10 border-green-500/20 text-green-500"
                          : booking.status === "pending"
                          ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
                          : "bg-red-500/10 border-red-500/20 text-red-500"
                      } capitalize`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-[10px] text-[var(--text-muted)]">
                      <span>Start: {new Date(booking.start_time).toLocaleString()}</span>
                      <span>End: {new Date(booking.end_time).toLocaleString()}</span>
                    </div>
                    {booking.purpose && (
                      <p className="text-xs text-[var(--text-secondary)] italic mt-2 bg-[var(--background)] p-2 rounded border border-[var(--border)]">&quot;{booking.purpose}&quot;</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-[var(--text-secondary)] py-12">
                You haven&apos;t reserved any bookings yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
