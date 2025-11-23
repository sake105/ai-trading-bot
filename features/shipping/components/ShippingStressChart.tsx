
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const DATA = [
    { route: 'Shanghai -> Rotterdam', stress: 85, status: 'Critical' },
    { route: 'Shenzhen -> LA', stress: 45, status: 'Normal' },
    { route: 'Singapore -> Suez', stress: 92, status: 'Blocked' },
    { route: 'Hamburg -> NY', stress: 30, status: 'Normal' },
];

export const ShippingStressChart: React.FC = () => {
    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 h-[400px]">
            <h3 className="font-bold text-white mb-6">Global Route Stress Index (AIS Data)</h3>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={DATA} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" domain={[0, 100]} stroke="#475569" />
                    <YAxis dataKey="route" type="category" stroke="#94a3b8" width={120} />
                    <Tooltip 
                        cursor={{fill: '#334155', opacity: 0.2}}
                        contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff'}}
                    />
                    <Bar dataKey="stress" radius={[0, 4, 4, 0]} barSize={20}>
                        {DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.stress > 80 ? '#ef4444' : entry.stress > 50 ? '#f59e0b' : '#10b981'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
