
import React, { useEffect, useState } from 'react';
import { BackendApi } from '../../api/backendApi';
import { QaStatus } from '../../types/domain';
import { AlertOctagon, CheckCircle2, Database, FileBarChart, Activity } from 'lucide-react';

export const QaPage: React.FC = () => {
  const [status, setStatus] = useState<QaStatus | null>(null);

  useEffect(() => {
    BackendApi.getQaStatus().then(setStatus);
  }, []);

  if (!status) return <div>Loading QA Status...</div>;

  const getStatusColor = (s: 'OK' | 'WARNING' | 'BLOCK') => {
      if (s === 'OK') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      if (s === 'WARNING') return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
  };

  return (
    <div className="space-y-8 animate-in fade-in">
        <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-indigo-400" />
                Quality Assurance Cockpit
            </h1>
            <p className="text-slate-400 text-sm mt-1">System health, data integrity, and model drift monitoring.</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl border ${status.dataOk ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Database className="w-5 h-5" /> Data Integrity
                    </h3>
                    {status.dataOk ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <AlertOctagon className="w-6 h-6 text-rose-500" />}
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-slate-400"><span>Missing Bars:</span> <span className="text-white">0</span></div>
                    <div className="flex justify-between text-slate-400"><span>Outliers:</span> <span className="text-white">0</span></div>
                    <div className="flex justify-between text-slate-400"><span>Sync Delay:</span> <span className="text-emerald-400">24ms</span></div>
                </div>
            </div>

            <div className={`p-6 rounded-xl border ${getStatusColor(status.leakageRisk)}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5" /> Leakage Check
                    </h3>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-slate-900/50">{status.leakageRisk}</span>
                </div>
                <p className="text-sm opacity-80 mb-4">Looks for Look-Ahead Bias in feature generation.</p>
                <div className="w-full bg-slate-900/50 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-current w-[2%]" />
                </div>
            </div>

            <div className={`p-6 rounded-xl border ${getStatusColor(status.modelDrift)}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <FileBarChart className="w-5 h-5" /> Model Drift
                    </h3>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-slate-900/50">{status.modelDrift}</span>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>PSI Score:</span> <span>0.12</span></div>
                    <div className="flex justify-between"><span>OOS Sharpe:</span> <span>{status.lastBacktestSharpe}</span></div>
                </div>
            </div>
        </div>

        {/* System Go/No-Go */}
        <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 text-center">
            <h2 className="text-slate-400 uppercase text-sm font-bold tracking-wider mb-4">Daily Trading Authorization</h2>
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className={`w-4 h-4 rounded-full ${status.canTradeToday ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]'}`}></div>
                <span className={`text-2xl font-bold ${status.canTradeToday ? 'text-white' : 'text-rose-500'}`}>
                    {status.canTradeToday ? 'SYSTEM GO' : 'TRADING HALTED'}
                </span>
            </div>
        </div>
    </div>
  );
};

import { ShieldCheck } from 'lucide-react';
