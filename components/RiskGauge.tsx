import React from 'react';
import { RiskMetrics } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, ReferenceLine } from 'recharts';

interface RiskGaugeProps {
  metrics: RiskMetrics;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ metrics }) => {
  
  // Generate Gaussian Bell Curve Data
  const generateNormalDist = (mean: number, stdDev: number) => {
    const data = [];
    // SAFETY GUARD: Prevent infinite loop if stdDev is 0 or very small
    const safeStdDev = Math.max(stdDev, 100); // Min width to prevent freeze
    const step = safeStdDev / 5;
    
    for (let x = mean - 4 * safeStdDev; x <= mean + 4 * safeStdDev; x += step) {
      const y = (1 / (safeStdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / safeStdDev, 2));
      data.push({ x, y, isTail: x < mean - 1.65 * safeStdDev }); // 1.65 is approx 95% one-sided
    }
    return data;
  };

  // Mock Daily PnL distribution based on current volatility
  // Volatility is annualized, so Daily Vol ~ Vol / 16
  // We handle the case where volatility might be 0 (initial state)
  const dailyStdDev = metrics.volatility > 0 
    ? (metrics.volatility / 100) * 100000 / 16 
    : 1000; // Default fallback width

  const data = generateNormalDist(0, dailyStdDev);

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
            <h3 className="text-lg font-semibold text-white">Value at Risk (VaR)</h3>
            <p className="text-xs text-slate-500">95% Confidence Interval (1 Day)</p>
        </div>
        <div className="text-right">
            <p className="text-2xl font-bold text-rose-400">-${Math.round(metrics.var95).toLocaleString()}</p>
            <p className="text-xs text-slate-500">Potential Loss Limit</p>
        </div>
      </div>

      <div className="h-40 w-full relative">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#e11d48" stopOpacity={0.8}/>
                <stop offset="30%" stopColor="#e11d48" stopOpacity={0.1}/>
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <Tooltip 
                content={() => null} // Custom tooltip disabled for cleaner look
                cursor={{ stroke: '#64748b', strokeWidth: 1 }}
            />
            <Area 
                type="monotone" 
                dataKey="y" 
                stroke="none" 
                fill="url(#colorRisk)" 
            />
            <ReferenceLine x={-metrics.var95} stroke="#e11d48" strokeDasharray="3 3" label={{ position: 'top', value: 'VaR 95%', fill: '#e11d48', fontSize: 10 }} />
            <ReferenceLine x={0} stroke="#475569" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="absolute bottom-0 w-full flex justify-between text-[10px] text-slate-500">
            <span>High Loss Probability</span>
            <span>Expected Return</span>
            <span>Profit Potential</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800">
         <div>
            <p className="text-[10px] text-slate-500 uppercase">Conditional VaR (Tail)</p>
            <p className="text-sm font-mono text-rose-300">-${Math.round(metrics.cvar95).toLocaleString()}</p>
         </div>
         <div>
            <p className="text-[10px] text-slate-500 uppercase">Portfolio Beta</p>
            <p className="text-sm font-mono text-indigo-300">{metrics.beta.toFixed(2)}</p>
         </div>
      </div>
    </div>
  );
};

export default RiskGauge;