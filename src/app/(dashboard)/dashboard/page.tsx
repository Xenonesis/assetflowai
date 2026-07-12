"use client";

import { Activity, Box, CheckCircle2, AlertTriangle, ArrowUpRight } from "lucide-react";
// In a real app we'd fetch this data from server components and pass it down
// Using recharts for visualization
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const assetData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 278 },
  { name: 'May', value: 189 },
  { name: 'Jun', value: 239 },
];

const maintenanceData = [
  { name: 'Week 1', issues: 4 },
  { name: 'Week 2', issues: 7 },
  { name: 'Week 3', issues: 2 },
  { name: 'Week 4', issues: 5 },
];

const statusData = [
  { name: 'Available', value: 400, color: '#16A34A' },
  { name: 'Allocated', value: 300, color: '#2563EB' },
  { name: 'Maintenance', value: 50, color: '#CA8A04' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Overview</h1>
        <p className="text-sm text-[var(--text-secondary)]">Your organization's asset intelligence at a glance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Assets" value="1,248" change="+12%" icon={<Box className="w-4 h-4" />} trend="up" />
        <KPICard title="Active Allocations" value="842" change="+5%" icon={<CheckCircle2 className="w-4 h-4" />} trend="up" />
        <KPICard title="Pending Maintenance" value="24" change="-2" icon={<AlertTriangle className="w-4 h-4" />} trend="down" />
        <KPICard title="System Activity" value="142" change="Today" icon={<Activity className="w-4 h-4" />} trend="neutral" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-6">Asset Growth</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'var(--background)' }} contentStyle={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-6">Asset Status Distribution</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {statusData.map(status => (
              <div key={status.name} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                {status.name}
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
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">{title}</h3>
        <div className="w-8 h-8 rounded-full bg-[var(--background)] flex items-center justify-center text-[var(--text-secondary)]">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-semibold text-[var(--text-primary)]">{value}</div>
        <div className={`flex items-center text-xs font-medium ${
          trend === 'up' ? 'text-[var(--success)]' : trend === 'down' ? 'text-[var(--danger)]' : 'text-[var(--text-secondary)]'
        }`}>
          {trend === 'up' && <ArrowUpRight className="w-3 h-3 mr-1" />}
          {change}
        </div>
      </div>
    </div>
  );
}
