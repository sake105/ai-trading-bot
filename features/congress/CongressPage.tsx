
import React from 'react';
import { Landmark, TrendingUp, Users } from 'lucide-react';
import { CongressTradesTable } from './components/CongressTradesTable';

export const CongressPage: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Landmark className="w-6 h-6 text-indigo-400" />
                        Congress Trading Tracker
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Monitoring legislative alpha (STOCK Act disclosures). 
                        <span className="text-amber-500 ml-2 font-bold">NOTE: Uses public data only.</span>
                    </p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-slate-400">Senate Net Flow (30d)</h3>
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold text-white">$12.5M <span className="text-emerald-400 text-sm">+ Buy</span></p>
                </div>
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-slate-400">Top Sector (Congress)</h3>
                        <Users className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-white">Defense <span className="text-slate-500 text-sm">XAR</span></p>
                </div>
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-slate-400">Unusual Whales Score</h3>
                        <Landmark className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-purple-400">High Activity</p>
                </div>
            </div>

            <CongressTradesTable />
        </div>
    );
};
