import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Fetch KPI Counts
  const { count: totalAssets } = await supabase
    .from("assets")
    .select("id", { count: "exact", head: true })
    .is("deleted_at", null);

  const { count: activeAllocations } = await supabase
    .from("allocations")
    .select("id", { count: "exact", head: true })
    .is("returned_at", null);

  const { count: pendingMaintenance } = await supabase
    .from("maintenance_requests")
    .select("id", { count: "exact", head: true })
    .not("status", "in", '("resolved","closed")');

  const { count: activityCount } = await supabase
    .from("activity_logs")
    .select("id", { count: "exact", head: true });

  interface AssetDashboardItem {
    status: string;
    created_at: string;
  }

  // 2. Fetch Assets for status distribution and growth charts
  const { data: assets } = (await supabase
    .from("assets")
    .select("status, created_at")
    .is("deleted_at", null)) as unknown as { data: AssetDashboardItem[] | null };

  // Group status distribution
  const statusCounts = assets?.reduce((acc: Record<string, number>, asset) => {
    acc[asset.status] = (acc[asset.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const statusColors: Record<string, string> = {
    available: '#10B981',
    allocated: '#3B82F6',
    maintenance: '#F59E0B',
    retired: '#6B7280',
    reserved: '#EC4899',
    disposed: '#EF4444'
  };

  const statusData = Object.entries(statusCounts).map(([status, value]) => ({
    name: status,
    value,
    color: statusColors[status] || 'var(--text-muted)'
  }));

  // Group monthly growth
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyCounts = assets?.reduce((acc: Record<string, number>, asset) => {
    const date = new Date(asset.created_at);
    const monthName = months[date.getMonth()];
    acc[monthName] = (acc[monthName] || 0) + 1;
    return acc;
  }, {}) || {};

  const assetGrowth = months.map(m => ({
    name: m,
    value: monthlyCounts[m] || 0
  })).slice(0, new Date().getMonth() + 1); // Only show months up to the current month

  const data = {
    totalAssets: totalAssets || 0,
    activeAllocations: activeAllocations || 0,
    pendingMaintenance: pendingMaintenance || 0,
    activityCount: activityCount || 0,
    assetGrowth,
    statusData
  };

  return <DashboardClient data={data} />;
}
