"use client";

import { Activity, Box, CheckCircle2, AlertTriangle, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardData {
  totalAssets: number;
  activeAllocations: number;
  pendingMaintenance: number;
  activityCount: number;
  assetGrowth: { name: string; value: number }[];
  statusData: { name: string; value: number; color: string }[];
}

export function DashboardClient({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Overview</h1>
        <p className="text-sm text-[var(--text-secondary)]">Your organization's asset intelligence at a glance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Assets" value={data.totalAssets.toLocaleString()} change="All items" icon={<Box className="w-4 h-4" />} trend="neutral" />
        <KPICard title="Active Custodies" value={data.activeAllocations.toLocaleString()} change="In possession" icon={<CheckCircle2 className="w-4 h-4" />} trend="neutral" />
        <KPICard title="Pending Work orders" value={data.pendingMaintenance.toLocaleString()} change="Needs fix" icon={<AlertTriangle className="w-4 h-4" />} trend="down" />
        <KPICard title="System Activity logs" value={data.activityCount.toLocaleString()} change="Audit trail" icon={<Activity className="w-4 h-4" />} trend="up" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-6">Asset Registration Timeline</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.assetGrowth} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'var(--background)' }} contentStyle={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Asset Status Distribution</h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            {data.statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-[var(--text-secondary)]">No status data available</div>
            )}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {data.statusData.map(status => (
              <div key={status.name} className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                <span className="capitalize">{status.name}: {status.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, change, icon, trend }: { title: string, value: string, change: string, icon: React.ReactNode, trend: 'up' | 'down' | 'neutral' }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">{title}</h3>
        <div className="w-8 h-8 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)]">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-semibold text-[var(--text-primary)]">{value}</div>
        <div className={`flex items-center text-xs font-semibold ${
          trend === 'up' ? 'text-[var(--success)]' : trend === 'down' ? 'text-[var(--danger)]' : 'text-[var(--text-secondary)]'
        }`}>
          {trend === 'up' && <ArrowUpRight className="w-3 h-3 mr-1" />}
          {change}
        </div>
      </div>
    </div>
  );
}
