
import React, { useState } from 'react';
import { TradeExecution } from '../types';
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, CircleDashed, ChevronDown, ChevronUp, Bot, FileText } from 'lucide-react';

interface TradeHistoryProps {
  trades: TradeExecution[];
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  // State to track which row is expanded
  const [expandedTradeId, setExpandedTradeId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    if (expandedTradeId === id) {
      setExpandedTradeId(null);
    } else {
      setExpandedTradeId(id);
    }
  };

  // Calculate Stats
  const totalTrades = trades.length;
  const winRate = totalTrades > 0 ? (trades.filter(t => t.netPnl > 0).length / totalTrades) * 100 : 0;
  const totalFees = trades.reduce((acc, t) => acc + t.fees, 0);
  const totalNetPnl = trades.reduce((acc, t) => acc + t.netPnl, 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
           <p className="text-xs text-slate-500 uppercase">Total Executions</p>
           <p className="text-2xl font-bold text-white">{totalTrades}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
           <p className="text-xs text-slate-500 uppercase">Realized Win Rate</p>
           <p className="text-2xl font-bold text-emerald-400">{winRate.toFixed(1)}%</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
           <p className="text-xs text-slate-500 uppercase">Total Commission/Fees</p>
           <p className="text-2xl font-bold text-rose-400">${totalFees.toFixed(2)}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
           <p className="text-xs text-slate-500 uppercase">Net Realized PnL</p>
           <p className={`text-2xl font-bold ${totalNetPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
             {totalNetPnl >= 0 ? '+' : ''}${totalNetPnl.toLocaleString()}
           </p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
             <h2 className="text-xl font-bold text-white">Execution Audit Log</h2>
             <p className="text-xs text-slate-500 mt-1">Immutable record of all system entries and exits.</p>
          </div>
          <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded border border-slate-700">
            Export CSV
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 font-medium font-mono text-xs uppercase">
              <tr>
                <th className="px-4 py-4 text-center w-10"></th>
                <th className="px-4 py-4">Time (UTC)</th>
                <th className="px-4 py-4">Strategy ID</th>
                <th className="px-4 py-4">Ticker</th>
                <th className="px-4 py-4">Side</th>
                <th className="px-4 py-4 text-right">Size</th>
                <th className="px-4 py-4 text-right">Entry</th>
                <th className="px-4 py-4 text-right">Exit</th>
                <th className="px-4 py-4 text-right">Net PnL</th>
                <th className="px-4 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {trades.map((trade) => {
                const isExpanded = expandedTradeId === trade.id;
                return (
                  <React.Fragment key={trade.id}>
                    <tr 
                        onClick={() => toggleExpand(trade.id)}
                        className={`transition-colors cursor-pointer group ${isExpanded ? 'bg-slate-800/60' : 'hover:bg-slate-800/30'}`}
                    >
                      <td className="px-4 py-4 text-center">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                           <span className="text-slate-300 font-mono">{trade.entryTime.split('T')[0]}</span>
                           <span className="text-slate-500 text-xs font-mono">{trade.entryTime.split('T')[1].substring(0, 5)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-500 text-xs font-mono">{trade.strategy}</td>
                      <td className="px-4 py-4 font-bold text-white">{trade.ticker}</td>
                      <td className="px-4 py-4">
                         <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded w-fit ${
                            trade.side === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                         }`}>
                            {trade.side === 'BUY' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {trade.side}
                         </span>
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-slate-300">{trade.quantity}</td>
                      <td className="px-4 py-4 text-right font-mono text-slate-300">${trade.entryPrice.toFixed(2)}</td>
                      <td className="px-4 py-4 text-right font-mono text-slate-300">{trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : '-'}</td>
                      <td className="px-4 py-4 text-right font-mono font-bold">
                         {trade.status === 'CLOSED' ? (
                            <span className={trade.netPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                               {trade.netPnl > 0 ? '+' : ''}{trade.netPnl.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                            </span>
                         ) : (
                            <span className="text-slate-600">---</span>
                         )}
                      </td>
                      <td className="px-4 py-4 text-center">
                         {trade.status === 'OPEN' ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400">
                               <CircleDashed className="w-4 h-4 animate-spin-slow" />
                            </span>
                         ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400">
                               <CheckCircle2 className="w-4 h-4" />
                            </span>
                         )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-slate-900/80 border-b border-slate-800">
                        <td colSpan={10} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2">
                            {/* PnL Breakdown */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                    <FileText className="w-3 h-3" /> PnL Breakdown
                                </h4>
                                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm space-y-1 font-mono">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Gross PnL:</span>
                                        <span className={trade.grossPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                            {trade.grossPnl > 0 ? '+' : ''}{trade.grossPnl.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Fees/Comm:</span>
                                        <span className="text-rose-400">-{trade.fees.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-slate-800 pt-1 mt-1 flex justify-between font-bold">
                                        <span className="text-slate-200">Net PnL:</span>
                                        <span className={trade.netPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                            {trade.netPnl > 0 ? '+' : ''}{trade.netPnl.toFixed(2)} USD
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Strategy & Context */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                    <Bot className="w-3 h-3" /> Strategy Context
                                </h4>
                                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Model:</span>
                                        <span className="text-indigo-300 font-mono text-xs">{trade.strategy}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Type:</span>
                                        <span className="text-slate-200 text-xs">{trade.autoGenerated ? 'Automated Algo' : 'Manual Execution'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Order ID:</span>
                                        <span className="text-slate-600 font-mono text-[10px]">{trade.id}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Timestamps */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> Execution Times
                                </h4>
                                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm space-y-2 font-mono text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Open:</span>
                                        <span className="text-slate-300">{new Date(trade.entryTime).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Close:</span>
                                        <span className="text-slate-300">{trade.exitTime ? new Date(trade.exitTime).toLocaleString() : '---'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Duration:</span>
                                        <span className="text-slate-300">
                                            {trade.exitTime 
                                                ? `${Math.round((new Date(trade.exitTime).getTime() - new Date(trade.entryTime).getTime()) / 60000)} min` 
                                                : 'Active'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TradeHistory;
