
import React from 'react';
import { PortfolioTarget } from '../types';
import { ArrowRight, CheckCircle, AlertTriangle, PieChart } from 'lucide-react';

interface PortfolioOptimizerProps {
  targets: PortfolioTarget[];
  totalCapital: number;
}

const PortfolioOptimizer: React.FC<PortfolioOptimizerProps> = ({ targets, totalCapital }) => {
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Summary Panel */}
      <div className="lg:col-span-1 space-y-6">
         <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
               <PieChart className="w-5 h-5 text-indigo-400" />
               Optimization Engine
            </h3>
            <p className="text-sm text-slate-400 mb-6">
               Based on Harry Markowitz's Mean-Variance Optimization. Suggestions maximize Sharpe Ratio while adhering to the 25% diversification cap.
            </p>
            
            <div className="space-y-4">
               <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <span className="text-xs text-slate-400">Rebalancing Needed</span>
                  <span className="text-sm font-bold text-amber-400">Yes</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <span className="text-xs text-slate-400">Est. Risk Reduction</span>
                  <span className="text-sm font-bold text-emerald-400">-12.5%</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <span className="text-xs text-slate-400">Turnover Cost</span>
                  <span className="text-sm font-bold text-slate-200">~$45.00</span>
               </div>
            </div>

            <button className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-colors">
               Execute All Rebalances
            </button>
         </div>
      </div>

      {/* Main Table */}
      <div className="lg:col-span-2">
         <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800">
               <h3 className="font-bold text-white">Target Allocation & Actions</h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="bg-slate-950 text-slate-500 text-xs uppercase">
                     <tr>
                        <th className="px-4 py-3">Asset</th>
                        <th className="px-4 py-3">Current Wgt</th>
                        <th className="px-4 py-3">Target Wgt</th>
                        <th className="px-4 py-3">Action</th>
                        <th className="px-4 py-3 text-right">Shares</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                     {targets.map(t => (
                        <tr key={t.ticker} className="hover:bg-slate-800/50">
                           <td className="px-4 py-3 font-bold text-white">{t.ticker}</td>
                           <td className="px-4 py-3 font-mono text-slate-400">{(t.currentWeight * 100).toFixed(1)}%</td>
                           <td className="px-4 py-3 font-mono text-indigo-300 font-bold">{(t.targetWeight * 100).toFixed(1)}%</td>
                           <td className="px-4 py-3">
                              {t.action === 'HOLD' ? (
                                 <span className="flex items-center gap-1 text-slate-500 text-xs">
                                    <CheckCircle className="w-3 h-3" /> Hold
                                 </span>
                              ) : t.action === 'BUY' ? (
                                 <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-900/20 px-2 py-1 rounded border border-emerald-500/20 w-fit">
                                    BUY <ArrowRight className="w-3 h-3" />
                                 </span>
                              ) : (
                                 <span className="flex items-center gap-1 text-rose-400 text-xs font-bold bg-rose-900/20 px-2 py-1 rounded border border-rose-500/20 w-fit">
                                    SELL <ArrowRight className="w-3 h-3" />
                                 </span>
                              )}
                              <div className="text-[10px] text-slate-500 mt-1">{t.reason}</div>
                           </td>
                           <td className="px-4 py-3 text-right font-mono">
                              {t.sharesDiff > 0 ? `+${t.sharesDiff}` : t.sharesDiff === 0 ? '-' : `${t.sharesDiff}`}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

    </div>
  );
};

export default PortfolioOptimizer;
