import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Tag, Box, ChevronRight } from "lucide-react";

export default async function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: category } = (await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single()) as any;

  if (!category) {
    return (
      <div className="p-8 text-center text-[var(--text-secondary)]">
        Category not found.
      </div>
    );
  }

  const { data: assets } = (await supabase
    .from("assets")
    .select("*, department:departments(name)")
    .eq("category_id", id)
    .is("deleted_at", null)) as any;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <Link href="/organization" className="hover:text-[var(--text-primary)] transition-colors">Organization</Link>
        <ChevronRight size={14} />
        <span>Categories</span>
        <ChevronRight size={14} />
        <span className="text-[var(--text-primary)]">{category.name}</span>
      </div>

      {/* Header Info */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 flex flex-col md:flex-row justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{category.name}</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-xl">
              {category.description || "No description provided."}
            </p>
            {category.icon && (
              <span className="px-2.5 py-0.5 text-xs rounded border border-[var(--border)] bg-[var(--background)] text-[var(--text-secondary)] inline-block mt-3">
                Icon: {category.icon}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Assets List */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--background)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box size={16} className="text-purple-500" />
            <h3 className="font-semibold text-[var(--text-primary)]">Assets in Category ({assets?.length || 0})</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          {assets && assets.length > 0 ? (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs text-[var(--text-secondary)] uppercase tracking-wider bg-[var(--background)]/50">
                  <th className="py-3 px-6 font-semibold">Asset Tag</th>
                  <th className="py-3 px-6 font-semibold">Name</th>
                  <th className="py-3 px-6 font-semibold">Department</th>
                  <th className="py-3 px-6 font-semibold">Condition</th>
                  <th className="py-3 px-6 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-sm">
                {assets.map((asset: any) => (
                  <tr key={asset.id} className="hover:bg-[var(--background)] transition-colors">
                    <td className="py-4 px-6 font-medium text-[var(--text-primary)]">
                      <Link href={`/assets/${asset.id}`} className="hover:underline">
                        {asset.asset_tag}
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-[var(--text-primary)]">{asset.name}</td>
                    <td className="py-4 px-6 text-[var(--text-secondary)]">{asset.department?.name || "N/A"}</td>
                    <td className="py-4 px-6 text-[var(--text-secondary)] capitalize">{asset.condition}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 text-xs rounded-full border ${
                        asset.status === "available"
                          ? "bg-green-500/10 border-green-500/20 text-green-500"
                          : asset.status === "allocated"
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                          : "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
                      }`}>
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-sm text-[var(--text-secondary)]">
              No assets found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
