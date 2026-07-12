import { createClient } from "@/lib/supabase/server";
import { FileText, Download, BarChart3, PieChart, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportButtons } from "./export-buttons";

interface AssetReportItem {
  purchase_cost: number | string | null;
  status: string;
  category_id: string;
  department_id: string;
}

export default async function ReportsPage() {
  const supabase = await createClient();

  // 1. Fetch KPI Metrics
  const { data: assets } = (await supabase
    .from("assets")
    .select("purchase_cost, status, category_id, department_id")
    .is("deleted_at", null)) as unknown as { data: AssetReportItem[] | null };

  const totalAssets = assets?.length || 0;
  const totalValue = assets?.reduce((sum, asset) => sum + Number(asset.purchase_cost || 0), 0) || 0;
  
  const statusCounts = assets?.reduce((acc: Record<string, number>, asset) => {
    acc[asset.status] = (acc[asset.status] || 0) + 1;
    return acc;
  }, {}) || {};

  // 2. Fetch Category mapping
  const { data: categories } = (await supabase
    .from("categories")
    .select("id, name")) as unknown as { data: { id: string; name: string }[] | null };
    
  const categoryMap = categories?.reduce((acc: Record<string, string>, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {}) || {};

  const categoryBreakdown = assets?.reduce((acc: Record<string, number>, asset) => {
    const name = categoryMap[asset.category_id] || "Other";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {}) || {};

  // 3. Fetch Department mapping
  const { data: departments } = (await supabase
    .from("departments")
    .select("id, name")) as unknown as { data: { id: string; name: string }[] | null };
    
  const deptMap = departments?.reduce((acc: Record<string, string>, dept) => {
    acc[dept.id] = dept.name;
    return acc;
  }, {}) || {};

  const departmentBreakdown = assets?.reduce((acc: Record<string, number>, asset) => {
    const name = deptMap[asset.department_id] || "Other";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <div className="space-y-6 print:p-8">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Analytics & Reports</h1>
          <p className="text-sm text-[var(--text-secondary)]">Generate asset valuation and distribution statements.</p>
        </div>
        <ExportButtons />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs text-[var(--text-secondary)] font-medium">Total Registered Assets</span>
            <div className="text-3xl font-bold text-[var(--text-primary)]">{totalAssets}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs text-[var(--text-secondary)] font-medium">Total Inventory Value</span>
            <div className="text-3xl font-bold text-[var(--text-primary)]">
              ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs text-[var(--text-secondary)] font-medium">Valuation per Asset (Avg)</span>
            <div className="text-3xl font-bold text-[var(--text-primary)]">
              ${totalAssets > 0 ? (totalValue / totalAssets).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[var(--primary)]" />
            Asset Breakdown by Category
          </h2>
          <div className="space-y-3">
            {Object.keys(categoryBreakdown).length > 0 ? (
              Object.entries(categoryBreakdown).map(([catName, count]) => {
                const percentage = totalAssets > 0 ? Math.round((count / totalAssets) * 100) : 0;
                return (
                  <div key={catName} className="space-y-1.5">
                    <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                      <span className="font-medium text-[var(--text-primary)]">{catName}</span>
                      <span>{count} assets ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--background)] border border-[var(--border)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[var(--primary)] rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-[var(--text-secondary)] text-center py-6">No assets categories populated.</div>
            )}
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-violet-500" />
            Asset Allocation by Department
          </h2>
          <div className="space-y-3">
            {Object.keys(departmentBreakdown).length > 0 ? (
              Object.entries(departmentBreakdown).map(([deptName, count]) => {
                const percentage = totalAssets > 0 ? Math.round((count / totalAssets) * 100) : 0;
                return (
                  <div key={deptName} className="space-y-1.5">
                    <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                      <span className="font-medium text-[var(--text-primary)]">{deptName}</span>
                      <span>{count} assets ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--background)] border border-[var(--border)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-violet-500 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-[var(--text-secondary)] text-center py-6">No departments populated.</div>
            )}
          </div>
        </div>

      </div>

      {/* Asset Status Summary Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-500" />
          Status Inventory Summarization
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--background)] text-[var(--text-secondary)] uppercase text-xs">
              <tr>
                <th className="px-6 py-3 font-medium border-b border-[var(--border)]">Inventory Status</th>
                <th className="px-6 py-3 font-medium border-b border-[var(--border)]">Count</th>
                <th className="px-6 py-3 font-medium border-b border-[var(--border)]">Allocation Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-[var(--text-secondary)]">
              {['available', 'allocated', 'maintenance', 'retired'].map((status) => {
                const count = statusCounts[status] || 0;
                const percentage = totalAssets > 0 ? Math.round((count / totalAssets) * 100) : 0;
                return (
                  <tr key={status}>
                    <td className="px-6 py-3 capitalize font-medium text-[var(--text-primary)]">{status}</td>
                    <td className="px-6 py-3">{count}</td>
                    <td className="px-6 py-3">{percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
