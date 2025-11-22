import React from 'react';
import { AssetSignal } from '../types';
import { ArrowUpRight, ArrowDownRight, Minus, BarChart2, Activity, Users, Newspaper } from 'lucide-react';

interface SignalsProps {
  signals: AssetSignal[];
}

const Signals: React.FC<SignalsProps> = ({ signals }) => {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-white">Market Signals & Technicals</h2>
           <p className="text-xs text-slate-500 mt-1">Includes Volume Analysis, RSI, and News/Insider Correlations</p>
        </div>
        <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          Model Version: v32.5 (News-Driven)
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-slate-400 font-medium">
            <tr>
              <th className="px-6 py-4">Ticker</th>
              <th className="px-6 py-4">Price / Vol</th>
              <th className="px-6 py-4">Trend / RSI</th>
              <th className="px-6 py-4">News & Sentiment</th>
              <th className="px-6 py-4">Smart Money</th>
              <th className="px-6 py-4">Signal</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {signals.map((signal) => (
              <tr key={signal.ticker} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${signal.sector === 'Index' ? 'bg-indigo-900 text-indigo-200' : 'bg-slate-800 text-slate-300'}`}>
                      {signal.ticker.substring(0, 3)}
                    </div>
                    <div>
                      <div className="font-medium text-white">{signal.ticker}</div>
                      <div className="text-xs text-slate-500">{signal.sector}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-white font-mono">${signal.price.toFixed(2)}</span>
                    <div className="flex items-center gap-1 mt-1">
                       <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                             className="h-full bg-blue-500" 
                             style={{ width: `${Math.min((signal.volume / (signal.volumeAvg || 1)) * 50, 100)}%` }}
                          ></div>
                       </div>
                       <span className="text-[10px] text-slate-500">{(signal.volume/1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${signal.trendScore > 70 ? 'bg-emerald-500' : signal.trendScore > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                          style={{ width: `${signal.trendScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-mono text-slate-400">T:{signal.trendScore}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${signal.rsi > 70 ? 'bg-rose-500/20 text-rose-400' : signal.rsi < 30 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                          RSI: {signal.rsi.toFixed(0)}
                       </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                     <div className="flex items-center gap-2">
                        <Newspaper className="w-3 h-3 text-slate-500" />
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                           {/* Center is 0, bar goes left or right */}
                           <div className="w-1/2 flex justify-end">
                              {signal.newsSentimentImpact < 0 && (
                                 <div className="h-full bg-rose-500 rounded-l" style={{ width: `${Math.min(Math.abs(signal.newsSentimentImpact) * 10, 100)}%` }}></div>
                              )}
                           </div>
                           <div className="w-1/2 flex justify-start border-l border-slate-700">
                              {signal.newsSentimentImpact > 0 && (
                                 <div className="h-full bg-emerald-500 rounded-r" style={{ width: `${Math.min(signal.newsSentimentImpact * 10, 100)}%` }}></div>
                              )}
                           </div>
                        </div>
                     </div>
                     <span className="text-[10px] text-slate-500 pl-5">
                        {signal.newsSentimentImpact > 2 ? 'Pos. News Flow' : signal.newsSentimentImpact < -2 ? 'Neg. Headlines' : 'Neutral'}
                     </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                     {signal.insiderActivity > 2 ? (
                        <span className="flex items-center gap-1 text-[10px] bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">
                           <Users className="w-3 h-3" /> INFLOW
                        </span>
                     ) : signal.insiderActivity < -2 ? (
                        <span className="flex items-center gap-1 text-[10px] bg-rose-900/30 text-rose-400 px-2 py-1 rounded border border-rose-500/20">
                           <Users className="w-3 h-3" /> OUTFLOW
                        </span>
                     ) : (
                        <span className="text-xs text-slate-600">-</span>
                     )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${signal.signal === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      signal.signal === 'SELL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                      'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                    {signal.signal === 'BUY' && <ArrowUpRight className="w-3 h-3" />}
                    {signal.signal === 'SELL' && <ArrowDownRight className="w-3 h-3" />}
                    {signal.signal === 'HOLD' && <Minus className="w-3 h-3" />}
                    {signal.signal}
                  </span>
                </td>
                <td className="px-6 py-4">
                   <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded border border-slate-700 transition-colors">
                     Details
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Signals;