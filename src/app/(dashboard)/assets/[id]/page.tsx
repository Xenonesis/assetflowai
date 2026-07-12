import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, Box, Calendar, Clock, Edit3, Settings, ShieldAlert, User, Wrench, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Asset } from "@/features/assets/types";

export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Asset details
  const { data: asset } = (await supabase
    .from("assets")
    .select(`
      *,
      department:departments(name),
      category:categories(name),
      holder:profiles!current_holder_id(full_name, email)
    `)
    .eq("id", id)
    .single()) as unknown as { data: Asset | null };

  if (!asset) {
    return (
      <div className="p-8 text-center space-y-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
        <ShieldAlert className="w-12 h-12 text-[var(--danger)] mx-auto" />
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Asset not found</h2>
        <Link href="/assets">
          <Button variant="outline" className="border-[var(--border)] text-[var(--text-primary)]">
            Back to Assets
          </Button>
        </Link>
      </div>
    );
  }

  interface AllocationHistory {
    id: string;
    allocated_at: string;
    returned_at: string | null;
    recipient?: { full_name: string } | null;
  }

  interface MaintenanceHistory {
    id: string;
    priority: string;
    status: string;
    description: string;
    assignee?: { full_name: string } | null;
  }

  // 2. Fetch Allocation history for this asset
  const { data: allocations } = (await supabase
    .from("allocations")
    .select("*, recipient:profiles!allocated_to(full_name)")
    .eq("asset_id", id)
    .order("allocated_at", { ascending: false })) as unknown as { data: AllocationHistory[] | null };

  // 3. Fetch Maintenance logs for this asset
  const { data: maintenance } = (await supabase
    .from("maintenance_requests")
    .select("*, assignee:profiles!assigned_to(full_name)")
    .eq("asset_id", id)
    .order("created_at", { ascending: false })) as unknown as { data: MaintenanceHistory[] | null };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-[var(--success)]/10 text-[var(--success)]";
      case "allocated": return "bg-[var(--primary)]/10 text-[var(--primary)]";
      case "maintenance": return "bg-[var(--warning)]/10 text-[var(--warning)]";
      default: return "bg-[var(--text-muted)]/10 text-[var(--text-secondary)]";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Link href="/assets" className="hover:text-[var(--text-primary)] transition-colors">Assets</Link>
        <span>/</span>
        <span className="text-[var(--text-primary)]">{asset.name}</span>
      </div>

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{asset.name}</h1>
            <span className={`px-2.5 py-1 text-xs rounded-full font-bold capitalize ${getStatusColor(asset.status)}`}>
              {asset.status}
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] font-mono">{asset.asset_tag}</p>
        </div>
        <Link href={`/assets/${asset.id}/edit`}>
          <Button variant="outline" className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] font-semibold">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Asset
          </Button>
        </Link>
      </div>

      {/* Grid of metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core Specs */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 space-y-4 shadow-sm md:col-span-2">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
            <Box className="w-4 h-4 text-[var(--primary)]" />
            Asset Specifications
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-[var(--text-secondary)] block">Serial Number</span>
              <span className="font-semibold text-[var(--text-primary)]">{asset.serial_number || "-"}</span>
            </div>
            <div>
              <span className="text-xs text-[var(--text-secondary)] block">Category</span>
              <span className="font-semibold text-[var(--text-primary)]">{asset.category?.name || "Uncategorized"}</span>
            </div>
            <div>
              <span className="text-xs text-[var(--text-secondary)] block">Department</span>
              <span className="font-semibold text-[var(--text-primary)]">{asset.department?.name || "Unassigned"}</span>
            </div>
            <div>
              <span className="text-xs text-[var(--text-secondary)] block">Purchase Cost</span>
              <span className="font-semibold text-[var(--text-primary)]">${Number(asset.purchase_cost || 0).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-xs text-[var(--text-secondary)] block">Location / Shelf</span>
              <span className="font-semibold text-[var(--text-primary)]">{asset.location || "-"}</span>
            </div>
            <div>
              <span className="text-xs text-[var(--text-secondary)] block">Asset Condition</span>
              <span className="font-semibold text-[var(--text-primary)] capitalize">{asset.condition}</span>
            </div>
            {asset.photo && (
              <div className="col-span-2 border-t border-[var(--border)] pt-4 mt-2">
                <span className="text-xs text-[var(--text-secondary)] block mb-1">Attached Document / Receipt</span>
                <a 
                  href={asset.photo} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--primary)] hover:underline bg-[var(--primary)]/10 px-3 py-1.5 rounded-lg border border-[var(--primary)]/20"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Document
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Current Custody & QR Code Widget Column */}
        <div className="space-y-6">
          {/* Custody Card */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-violet-500" />
              Current Custody
            </h2>
            {asset.holder ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-bold flex items-center justify-center">
                    {asset.holder.full_name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[var(--text-primary)]">{asset.holder.full_name}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{asset.holder.email}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[var(--text-secondary)] py-6 text-center">
                No active assignee. This asset is currently sitting in inventory.
              </div>
            )}
          </div>

          {/* QR Code Tag Card */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
              <Settings className="w-4 h-4 text-[var(--primary)]" />
              Asset Tag QR Code
            </h2>
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://assetflowai.enterprise/assets/${asset.id}`)}&color=0d9488&bgcolor=ffffff`}
                alt={`Asset QR Code`} 
                className="w-36 h-36 border border-[var(--border)] rounded-lg p-2 bg-white"
              />
              <span className="text-xs text-[var(--text-secondary)] font-mono uppercase tracking-wider">{asset.asset_tag}</span>
            </div>
          </div>
        </div>

      </div>

      {/* History timeline log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Allocations History */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            Allocation Logs
          </h3>
          <div className="space-y-3">
            {allocations && allocations.length > 0 ? (
              allocations.map((alloc) => (
                <div key={alloc.id} className="flex justify-between items-center text-xs p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg">
                  <div>
                    <span className="font-semibold text-[var(--text-primary)]">{alloc.recipient?.full_name || 'User'}</span>
                    <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">Assigned {new Date(alloc.allocated_at).toLocaleDateString()}</div>
                  </div>
                  {alloc.returned_at ? (
                    <span className="text-[10px] text-[var(--text-secondary)]">Returned {new Date(alloc.returned_at).toLocaleDateString()}</span>
                  ) : (
                    <span className="text-[10px] text-[var(--success)] font-semibold">Currently Active</span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-xs text-[var(--text-secondary)] text-center py-6">No allocations logged.</div>
            )}
          </div>
        </div>

        {/* Maintenance Logs */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-emerald-500" />
            Maintenance Records
          </h3>
          <div className="space-y-3">
            {maintenance && maintenance.length > 0 ? (
              maintenance.map((m) => (
                <div key={m.id} className="space-y-1 p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[var(--text-primary)] capitalize">{m.priority} Priority</span>
                    <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">{m.status}</span>
                  </div>
                  <p className="text-[var(--text-secondary)]">{m.description}</p>
                </div>
              ))
            ) : (
              <div className="text-xs text-[var(--text-secondary)] text-center py-6">No maintenance requests logged.</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
