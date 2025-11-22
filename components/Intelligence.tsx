import React from 'react';
import { NewsItem, InsiderTrade, ShippingRoute } from '../types';
import { MessageSquare, Anchor, Briefcase, Radio, ExternalLink, TrendingUp, AlertTriangle } from 'lucide-react';

interface IntelligenceProps {
  news: NewsItem[];
  insiderTrades: InsiderTrade[];
  shippingRoutes: ShippingRoute[];
}

const Intelligence: React.FC<IntelligenceProps> = ({ news, insiderTrades, shippingRoutes }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Column 1: News & Telegram Feed */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              Live Intelligence Feed
            </h3>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded">Real-time</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {news.map((item) => (
              <div key={item.id} className="group relative pl-4 border-l-2 border-slate-800 hover:border-indigo-500 transition-colors">
                <div className="flex justify-between items-start mb-1">
                   <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      item.source === 'Telegram' ? 'bg-blue-500/20 text-blue-400' :
                      item.source === 'CNBC' ? 'bg-purple-500/20 text-purple-400' :
                      item.source === 'Insider' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-700 text-slate-300'
                   }`}>
                      {item.source}
                   </span>
                   <span className="text-[10px] text-slate-500">{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                {item.author && <p className="text-xs text-slate-400 font-medium mb-1">@{item.author}</p>}
                <h4 className="text-sm text-slate-200 font-medium leading-snug group-hover:text-white">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.summary}</p>
                <div className="mt-2 flex items-center gap-2">
                   {item.sentiment === 'POSITIVE' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                   {item.sentiment === 'NEGATIVE' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>}
                   <span className="text-[10px] text-slate-600 uppercase">{item.sentiment} Sentiment</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Column 2: Insider Trading & Smart Money */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-900 rounded-xl border border-slate-800">
           <div className="p-4 border-b border-slate-800">
              <h3 className="font-bold text-white flex items-center gap-2">
                 <Briefcase className="w-4 h-4 text-emerald-400" />
                 Significant Insider Trades
              </h3>
              <p className="text-xs text-slate-500 mt-1">Senators, CEOs, and Institutional Whales</p>
           </div>
           <div className="p-0">
              <table className="w-full text-sm text-left">
                 <thead className="bg-slate-950 text-slate-500 text-xs uppercase">
                    <tr>
                       <th className="px-4 py-3">Person</th>
                       <th className="px-4 py-3">Asset</th>
                       <th className="px-4 py-3 text-right">Value</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800">
                    {insiderTrades.map((trade) => (
                       <tr key={trade.id} className="hover:bg-slate-800/50">
                          <td className="px-4 py-3">
                             <div className="font-medium text-slate-200">{trade.person}</div>
                             <div className="text-[10px] text-slate-500">{trade.role}</div>
                          </td>
                          <td className="px-4 py-3">
                             <div className="flex items-center gap-2">
                                <span className="font-mono text-xs">{trade.ticker}</span>
                                <span className={`text-[10px] px-1.5 rounded ${trade.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                   {trade.type}
                                </span>
                             </div>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-slate-300">
                             ${(trade.amount / 1000000).toFixed(1)}M
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           <div className="p-3 border-t border-slate-800 text-center">
              <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-1 w-full">
                 View Full Filings <ExternalLink className="w-3 h-3" />
              </button>
           </div>
        </div>

        {/* Global Money Flow Placeholder */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
           <h3 className="font-bold text-white text-sm mb-4">Institutional Net Flow (7D)</h3>
           <div className="space-y-3">
              <div>
                 <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Tech (XLK)</span>
                    <span className="text-emerald-400">+$1.2B</span>
                 </div>
                 <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[75%]"></div>
                 </div>
              </div>
              <div>
                 <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Energy (XLE)</span>
                    <span className="text-rose-400">-$450M</span>
                 </div>
                 <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-[35%]"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Column 3: Alternative Data (Shipping/Logistics) */}
      <div className="lg:col-span-1 space-y-6">
         <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-900">
               <h3 className="font-bold text-white flex items-center gap-2">
                  <Anchor className="w-4 h-4 text-blue-400" />
                  Global Logistics & Shipping
               </h3>
               <p className="text-xs text-slate-500 mt-1">Supply Chain Health via Satellite/Port Data</p>
            </div>
            
            <div className="bg-slate-950 p-4 min-h-[200px] relative border-b border-slate-800">
               {/* Abstract Map Visualization */}
               <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center bg-no-repeat"></div>
               
               <div className="relative z-10 space-y-6 mt-4">
                  {shippingRoutes.map(route => (
                     <div key={route.id} className="flex items-center justify-between bg-slate-900/80 p-2 rounded backdrop-blur-sm border border-slate-700">
                        <div>
                           <div className="text-xs text-slate-300 font-medium">{route.name}</div>
                           <div className="text-[10px] text-slate-500 flex items-center gap-1">
                              Cost Index: {route.costIndex}
                              {route.trend === 'UP' && <TrendingUp className="w-3 h-3 text-rose-400" />}
                           </div>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded font-bold border ${
                           route.status === 'Normal' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                           route.status === 'Congested' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                           'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                           {route.status}
                        </span>
                     </div>
                  ))}
               </div>
            </div>
            
            <div className="p-4 bg-slate-900">
               <div className="flex items-start gap-3 p-3 bg-amber-900/20 border border-amber-500/20 rounded">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                     <h4 className="text-sm text-amber-500 font-bold">Supply Chain Alert</h4>
                     <p className="text-xs text-amber-200/70 mt-1">
                        High congestion in Panama Canal impacting East Coast US deliveries. Retail sector stocks may face inventory delays Q4.
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Flight Routes / Transport Activity */}
         <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
            <h3 className="font-bold text-white text-sm mb-2">Global Air Cargo Capacity</h3>
            <div className="flex items-end gap-2 h-24 mt-2">
               {[40, 55, 45, 60, 75, 65, 80].map((h, i) => (
                  <div key={i} className="flex-1 bg-slate-800 rounded-t hover:bg-indigo-500 transition-colors relative group">
                     <div className="absolute bottom-0 w-full bg-indigo-600 rounded-t" style={{height: `${h}%`}}></div>
                  </div>
               ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-2">
               <span>Mon</span>
               <span>Sun</span>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Intelligence;