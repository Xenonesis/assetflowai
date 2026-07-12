import { getAssets } from "@/features/assets/actions/asset-actions";
import Link from "next/link";
import { Plus, QrCode, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AssetsPage(props: { searchParams?: Promise<{ q?: string }> }) {
  const searchParams = await (props.searchParams ?? Promise.resolve({} as { q?: string }));
  const query = (searchParams.q || "").toLowerCase();
  let assets = await getAssets();
  if (query) {
    assets = assets.filter((a: any) =>
      (a.name?.toLowerCase() || "").includes(query) ||
      (a.asset_tag?.toLowerCase() || "").includes(query) ||
      (a.serial_number?.toLowerCase() || "").includes(query)
    );
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'bg-[var(--success)]/10 text-[var(--success)]';
      case 'allocated': return 'bg-[var(--primary)]/10 text-[var(--primary)]';
      case 'maintenance': return 'bg-[var(--warning)]/10 text-[var(--warning)]';
      case 'retired': return 'bg-[var(--text-muted)]/10 text-[var(--text-secondary)]';
      default: return 'bg-[var(--surface-elevated)] text-[var(--text-primary)]';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Assets</h1>
          <p className="text-sm text-[var(--text-secondary)]">Manage your organization's physical inventory.</p>
        </div>
        <Link href="/assets/new">
          <Button className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]">
            <Plus className="w-4 h-4 mr-2" />
            Register Asset
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <form method="GET" className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input 
            type="text" 
            name="q"
            defaultValue={query}
            placeholder="Search by name, tag, or serial..." 
            className="w-full pl-9 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-[var(--text-primary)]"
          />
        </form>
        <Button variant="outline" className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface)]">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--background)] text-[var(--text-secondary)] uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Asset</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Category</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Department</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Status</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)]">Holder</th>
                <th className="px-6 py-4 font-medium border-b border-[var(--border)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {assets && assets.length > 0 ? (
                assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-[var(--background)] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--text-primary)]">{asset.name}</div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">{asset.asset_tag}</div>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      {asset.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      {asset.department?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-medium capitalize ${getStatusColor(asset.status)}`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      {asset.holder?.full_name || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-[var(--text-secondary)] hover:text-[var(--primary)]" title="Generate QR">
                          <QrCode className="w-4 h-4" />
                        </Button>
                        <Link href={`/assets/${asset.id}`}>
                          <Button size="sm" variant="outline" className="h-8 border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]">
                            View
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                    No assets found. Register your first asset to get started.
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
