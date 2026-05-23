'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts';

type TooltipPayloadItem = {
  color?: string;
  name?: string;
  stroke?: string;
  value?: number | string;
};

type CustomTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: TooltipPayloadItem[];
};

const data = [
  { name: 'Jan', applications: 400, interviews: 240, hires: 140 },
  { name: 'Feb', applications: 300, interviews: 139, hires: 80 },
  { name: 'Mar', applications: 980, interviews: 200, hires: 200 },
  { name: 'Apr', applications: 390, interviews: 278, hires: 110 },
  { name: 'May', applications: 480, interviews: 189, hires: 90 },
  { name: 'Jun', applications: 380, interviews: 239, hires: 120 },
];

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-xl">
        <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center gap-6 justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.stroke || item.color }} />
                <span className="text-xs font-bold text-slate-300 capitalize">{item.name}</span>
              </div>
              <span className="text-xs font-black text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

interface RecruitmentAnalyticsProps {
  initialData?: ReadonlyArray<{ name: string; applications: number; interviews: number; hires: number }>;
}

export default function RecruitmentAnalytics({ initialData }: RecruitmentAnalyticsProps) {
  const displayData = initialData || data;

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 h-full shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Recruitment Pipeline</h2>
          <p className="text-sm text-slate-500 mt-1">Application flow over the last 6 months</p>
        </div>
        <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold px-4 py-2 focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200">
          <option>Last 6 Months</option>
          <option>Last Year</option>
        </select>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingBottom: 20, fontSize: 11, fontWeight: 'bold' }}
            />
            <Bar 
              name="Hires" 
              dataKey="hires" 
              stackId="a" 
              fill="#10b981" 
            />
            <Bar 
              name="Interviews" 
              dataKey="interviews" 
              stackId="a" 
              fill="#8b5cf6" 
            />
            <Bar 
              name="Applications" 
              dataKey="applications" 
              stackId="a" 
              fill="#6366f1" 
              radius={[6, 6, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
