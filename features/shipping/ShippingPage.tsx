
import React from 'react';
import { Anchor, Container, Map } from 'lucide-react';
import { ShippingStressChart } from './components/ShippingStressChart';

export const ShippingPage: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Anchor className="w-6 h-6 text-blue-400" />
                        Global Shipping & Logistics
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Tracking supply chain bottlenecks via Satellite/AIS data.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ShippingStressChart />
                
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Container className="w-5 h-5 text-amber-400" /> Port Congestion Alerts
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-lg flex gap-4">
                            <div className="w-12 h-12 rounded bg-rose-900/20 flex items-center justify-center text-rose-500 font-bold">SZ</div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Suez Canal</h4>
                                <p className="text-xs text-slate-400 mt-1">Avg. Wait Time: <span className="text-rose-400">14 Days</span> (+400%)</p>
                                <p className="text-[10px] text-slate-500 mt-2">Impact: Oil, LNG, Auto Parts</p>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex gap-4 opacity-60">
                            <div className="w-12 h-12 rounded bg-emerald-900/20 flex items-center justify-center text-emerald-500 font-bold">LA</div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Los Angeles / Long Beach</h4>
                                <p className="text-xs text-slate-400 mt-1">Avg. Wait Time: <span className="text-emerald-400">2 Days</span> (Normal)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
