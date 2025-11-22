import React from 'react';
import { Activity, TrendingUp, ShieldAlert, DollarSign, BarChart3, Zap, Globe, ArrowUp, ArrowDown } from 'lucide-react';
import { SystemStatus, MarketRegime } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  status: SystemStatus;
}

const Dashboard: React.FC<DashboardProps> = ({ status }) => {
  
  const getRegimeColor = (regime: MarketRegime) => {
    switch (regime) {
      case MarketRegime.RISK_ON: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case MarketRegime.RISK_OFF: return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    }
  };

  const mockExposureData = [
    { name: 'Equity (Long)', value: 65 },
    { name: 'Hedges (Put)', value: 5 },
    { name: 'Cash', value: 30 },
  ];

  // Mock Indices Data for Dashboard Header
  const indices = [
    { name: 'S&P 500', value: '4,785.20', change: '+1.2%', up: true },
    { name: 'NASDAQ', value: '16,420.10', change: '+1.8%', up: true },
    { name: 'DOW JONES', value: '38,150.40', change: '-0.2%', up: false },
    { name: 'RUT 2000', value: '1,980.50', change: '+0.5%', up: true },
  ];

  return (
    <div className="space-y-6">
      
      {/* Indices Ticker */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {indices.map((idx) => (
          <div key={idx.name} className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex flex-col">
             <span className="text-xs text-slate-500 font-bold tracking-wider">{idx.name}</span>
             <div className="flex items-end justify-between mt-1">
                <span className="text-lg font-mono text-white">{idx.value}</span>
                <span className={`text-xs font-bold flex items-center ${idx.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                   {idx.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                   {idx.change}
                </span>
             </div>
          </div>
        ))}
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${getRegimeColor(status.regime)} transition-all duration-300`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider opacity-80">Market Regime</p>
              <h3 className="text-2xl font-bold mt-1">{status.regime.replace('_', ' ')}</h3>
            </div>
            <Activity className="h-8 w-8 opacity-50" />
          </div>
          <div className="mt-4 text-xs flex gap-2">
            <span className="bg-slate-900/50 px-2 py-1 rounded">VIX: {status.vix}</span>
            <span className="bg-slate-900/50 px-2 py-1 rounded">Sent: {status.sentimentScore}</span>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <p className="text-xs font-medium uppercase tracking-wider">Daily PnL</p>
            <DollarSign className="h-5 w-5" />
          </div>
          <h3 className={`text-2xl font-bold mt-1 ${status.dailyPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {status.dailyPnl >= 0 ? '+' : ''}{status.dailyPnl.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </h3>
          <p className="text-xs text-slate-500 mt-2">Realized + Unrealized</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <p className="text-xs font-medium uppercase tracking-wider">Active Positions</p>
            <BarChart3 className="h-5 w-5" />
          </div>
          <h3 className="text-2xl font-bold mt-1 text-white">{status.activePositions}</h3>
          <p className="text-xs text-slate-500 mt-2">Across 4 Sectors</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <p className="text-xs font-medium uppercase tracking-wider">VolTarget Usage</p>
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-2xl font-bold mt-1 text-blue-400">9.2% <span className="text-sm text-slate-500">/ 12%</span></h3>
          <p className="text-xs text-slate-500 mt-2">Risk Budget Utilization</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health / Exposure */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-indigo-400" />
            Portfolio Exposure Breakdown
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={mockExposureData}>
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} 
                  cursor={{ fill: '#334155', opacity: 0.2 }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {mockExposureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#34d399' : index === 1 ? '#f43f5e' : '#64748b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Logistics Quick View */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
             <Globe className="h-5 w-5 text-blue-400" />
             Global Context
          </h4>
          <div className="flex-1 flex flex-col justify-center gap-4">
             <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-400">Supply Chain Strain</span>
                <span className="text-sm font-bold text-amber-500">Elevated (65/100)</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-400">Insider Net Flow</span>
                <span className="text-sm font-bold text-emerald-400">+Buy Bias</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <span className="text-sm text-slate-400">News Sentiment</span>
                <span className="text-sm font-bold text-slate-200">Neutral-Positive</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;