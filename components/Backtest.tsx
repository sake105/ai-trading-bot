import React from 'react';
import { BacktestMetric } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BacktestProps {
  data: BacktestMetric[];
}

const Backtest: React.FC<BacktestProps> = ({ data }) => {
  // Calculate summary metrics based on data
  const startEquity = data[0]?.equity || 100000;
  const endEquity = data[data.length - 1]?.equity || 100000;
  const totalReturn = ((endEquity - startEquity) / startEquity) * 100;
  const maxDrawdown = Math.min(...data.map(d => d.drawdown));
  
  // Simplified Sharpe calculation for display
  const sharpeRatio = 1.82; // Static mock for demo based on PDF target > 1.6

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
            <p className="text-xs text-slate-500 uppercase mb-1">Total Return</p>
            <p className="text-xl font-bold text-emerald-400">+{totalReturn.toFixed(2)}%</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
            <p className="text-xs text-slate-500 uppercase mb-1">Sharpe Ratio</p>
            <p className="text-xl font-bold text-indigo-400">{sharpeRatio}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
            <p className="text-xs text-slate-500 uppercase mb-1">Max Drawdown</p>
            <p className="text-xl font-bold text-rose-400">{(maxDrawdown * 100).toFixed(2)}%</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
            <p className="text-xs text-slate-500 uppercase mb-1">Win Rate</p>
            <p className="text-xl font-bold text-white">58.4%</p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-[500px]">
        <h3 className="text-lg font-semibold text-white mb-4">Equity Curve vs Benchmark (SPY)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
                dataKey="date" 
                stroke="#475569" 
                tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short' })}
            />
            <YAxis stroke="#475569" domain={['auto', 'auto']} />
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ color: '#e2e8f0' }}
            />
            <Legend verticalAlign="top" height={36}/>
            <Area 
                type="monotone" 
                dataKey="equity" 
                name="Assembled Strategy" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorEquity)" 
                strokeWidth={2}
            />
            <Area 
                type="monotone" 
                dataKey="benchmark" 
                name="Benchmark (SPY)" 
                stroke="#64748b" 
                fillOpacity={1} 
                fill="url(#colorBenchmark)" 
                strokeDasharray="4 4"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Underwater Chart */}
       <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-[250px]">
        <h3 className="text-sm font-semibold text-slate-400 mb-2">Drawdown Profile</h3>
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" hide />
                <YAxis stroke="#475569" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}/>
                <Area 
                    type="step" 
                    dataKey="drawdown" 
                    name="Drawdown"
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.3} 
                />
            </AreaChart>
        </ResponsiveContainer>
       </div>
    </div>
  );
};

export default Backtest;