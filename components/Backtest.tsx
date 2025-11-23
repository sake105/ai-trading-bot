import React, { useState, useMemo } from 'react';
import { BacktestMetric, MarketRegime } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, Filter, TrendingUp } from 'lucide-react';

interface BacktestProps {
  data: BacktestMetric[];
}

type TimeRange = '1M' | '3M' | '6M' | '1Y' | '3Y' | 'ALL';
type RegimeFilter = 'ALL' | MarketRegime;

const Backtest: React.FC<BacktestProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('ALL');
  const [regimeFilter, setRegimeFilter] = useState<RegimeFilter>('ALL');

  // Filter Data Logic
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    let processed = [...data];

    // 1. Filter by Time Range
    // Assumes data is sorted ascending (Oldest -> Newest) as per App.tsx generator
    const lastDateStr = data[data.length - 1].date;
    const lastDate = new Date(lastDateStr);
    
    if (timeRange !== 'ALL') {
      const cutoff = new Date(lastDate);
      switch (timeRange) {
        case '1M': cutoff.setMonth(cutoff.getMonth() - 1); break;
        case '3M': cutoff.setMonth(cutoff.getMonth() - 3); break;
        case '6M': cutoff.setMonth(cutoff.getMonth() - 6); break;
        case '1Y': cutoff.setFullYear(cutoff.getFullYear() - 1); break;
        case '3Y': cutoff.setFullYear(cutoff.getFullYear() - 3); break;
      }
      processed = processed.filter(d => new Date(d.date) >= cutoff);
    }

    // 2. Filter by Regime
    if (regimeFilter !== 'ALL') {
        processed = processed.filter(d => d.regime === regimeFilter);
    }

    return processed;
  }, [data, timeRange, regimeFilter]);

  // Metrics Calculation based on filtered view
  const startEquity = filteredData[0]?.equity || 100000;
  const endEquity = filteredData[filteredData.length - 1]?.equity || 100000;
  
  // Calculate return for the specific period/regime view
  const totalReturn = filteredData.length > 0 ? ((endEquity - startEquity) / startEquity) * 100 : 0;
  
  const maxDrawdown = filteredData.length > 0 
    ? Math.min(...filteredData.map(d => d.drawdown)) 
    : 0;
  
  // Win rate calculation on the filtered set (Simplified based on daily moves)
  let winCount = 0;
  let lossCount = 0;
  for (let i = 1; i < filteredData.length; i++) {
      if (filteredData[i].equity > filteredData[i-1].equity) winCount++;
      else lossCount++;
  }
  const winRate = (winCount + lossCount) > 0 ? (winCount / (winCount + lossCount)) * 100 : 0;

  const sharpeRatio = 1.82; // Static for demo, or calc dynamically if needed

  return (
    <div className="space-y-6">
      
      {/* Filter Controls */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div className="flex items-center gap-2">
            <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
                <TrendingUp className="w-5 h-5" />
            </div>
            <div>
                <h3 className="text-white font-semibold">Performance Analysis</h3>
                <p className="text-xs text-slate-500">
                  {data.length > 400 ? '10-Year Deep Simulation' : 'Historical Results'}
                </p>
            </div>
         </div>

         <div className="flex flex-wrap items-center gap-4">
            {/* Time Range */}
            <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800">
                <span className="px-2 text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Range:
                </span>
                {(['1M', '6M', '1Y', '3Y', 'ALL'] as TimeRange[]).map((range) => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                            timeRange === range 
                            ? 'bg-slate-800 text-white shadow-sm' 
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        {range}
                    </button>
                ))}
            </div>

            {/* Regime Filter */}
            <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800">
                <span className="px-2 text-xs text-slate-500 flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Regime:
                </span>
                <select 
                    value={regimeFilter}
                    onChange={(e) => setRegimeFilter(e.target.value as RegimeFilter)}
                    className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer px-2 py-1"
                >
                    <option value="ALL">All Regimes</option>
                    <option value={MarketRegime.RISK_ON}>Risk On Only</option>
                    <option value={MarketRegime.RISK_OFF}>Risk Off Only</option>
                </select>
            </div>
         </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50 group-hover:bg-emerald-500 transition-colors"></div>
            <p className="text-xs text-slate-500 uppercase mb-1">Period Return</p>
            <p className={`text-xl font-bold ${totalReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {totalReturn >= 0 ? '+' : ''}{totalReturn.toLocaleString(undefined, {maximumFractionDigits: 2})}%
            </p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50 group-hover:bg-indigo-500 transition-colors"></div>
            <p className="text-xs text-slate-500 uppercase mb-1">Sharpe Ratio</p>
            <p className="text-xl font-bold text-indigo-400">{sharpeRatio}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500/50 group-hover:bg-rose-500 transition-colors"></div>
            <p className="text-xs text-slate-500 uppercase mb-1">Max Drawdown</p>
            <p className="text-xl font-bold text-rose-400">{(maxDrawdown * 100).toFixed(2)}%</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50 group-hover:bg-blue-500 transition-colors"></div>
            <p className="text-xs text-slate-500 uppercase mb-1">Daily Win Rate</p>
            <p className="text-xl font-bold text-white">{winRate > 0 ? winRate.toFixed(1) : '---'}%</p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-[500px]">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Equity Curve vs Benchmark (SPY)</h3>
            {regimeFilter !== 'ALL' && (
                <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded border border-amber-500/20">
                    Filtered by {regimeFilter}
                </span>
            )}
        </div>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { year: '2-digit' })}
                minTickGap={50}
            />
            <YAxis 
                stroke="#475569" 
                domain={['auto', 'auto']} 
                tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ color: '#e2e8f0' }}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
                formatter={(value: number) => [`$${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`, '']}
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
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={filteredData} margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" hide />
                <YAxis stroke="#475569" tickFormatter={(val) => `${(val * 100).toFixed(0)}%`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, 'Drawdown']}
                />
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