
import React, { useState, useRef } from 'react';
import { NewsItem, InsiderTrade, ShippingRoute } from '../types';
import { ANDREAS_GRASSL_CHANNELS } from '../constants';
import { MessageSquare, Anchor, Briefcase, Radio, ExternalLink, TrendingUp, AlertTriangle, Search, Video, Mic, Send, Twitter, Instagram, Youtube, Upload, ScanEye, Loader2 } from 'lucide-react';
import { analyzeScreenshot } from '../services/geminiService';

interface IntelligenceProps {
  news: NewsItem[];
  insiderTrades: InsiderTrade[];
  shippingRoutes: ShippingRoute[];
}

const Intelligence: React.FC<IntelligenceProps> = ({ news, insiderTrades, shippingRoutes }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter Logic
  const filteredNews = news.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      (item.relatedTicker && item.relatedTicker.toLowerCase().includes(query)) ||
      (item.author && item.author.toLowerCase().includes(query)) ||
      item.source.toLowerCase().includes(query)
    );
  });

  const getIcon = (type: string) => {
      switch(type) {
          case 'send': return <Send className="w-4 h-4 text-blue-400" />;
          case 'video': return <Video className="w-4 h-4 text-pink-500" />;
          case 'youtube': return <Youtube className="w-4 h-4 text-red-500" />;
          case 'mic': return <Mic className="w-4 h-4 text-emerald-500" />;
          case 'twitter': return <Twitter className="w-4 h-4 text-white" />;
          case 'instagram': return <Instagram className="w-4 h-4 text-purple-500" />;
          default: return <ExternalLink className="w-4 h-4 text-slate-400" />;
      }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingImage(true);
    setUploadFeedback(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
            const result = await analyzeScreenshot(base64String);
            
            setUploadFeedback({
                msg: `Analyzed! Found ${result.tickers.join(', ') || 'Market Info'}: ${result.sentiment}`,
                type: 'success'
            });

            // Ideally, here we would dispatch an action to add this to the App state
            // For now, we just show the feedback that AI understood the screenshot
            console.log("AI Analysis Result:", result);

        } catch (err) {
            setUploadFeedback({ msg: "Failed to analyze image.", type: 'error' });
        } finally {
            setIsAnalyzingImage(false);
        }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Column 1: News & Telegram Feed */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Andreas Grassl / World Politics Daily Hub */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-indigo-900/10">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-indigo-400" />
                    Human Intelligence Sources
                </h3>
                <p className="text-xs text-slate-400 mt-1">Verified Channels (Andreas Grassl / WPD)</p>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto custom-scrollbar">
                {ANDREAS_GRASSL_CHANNELS.map((channel) => (
                    <a 
                        key={channel.url} 
                        href={channel.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-slate-800/50 hover:bg-slate-800 rounded border border-slate-700/50 hover:border-indigo-500/50 transition-all group"
                    >
                        <div className="bg-slate-900 p-1.5 rounded group-hover:scale-110 transition-transform">
                            {getIcon(channel.icon)}
                        </div>
                        <span className="text-xs text-slate-300 font-medium truncate">{channel.name.split('(')[0]}</span>
                    </a>
                ))}
            </div>
        </div>

        {/* Screenshot Analyzer Widget */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 border-dashed border-indigo-500/30 hover:border-indigo-500/60 transition-colors">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                    <ScanEye className="w-4 h-4 text-rose-400" />
                    Social Media Analyzer
                </h3>
                <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400">AI Vision</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
                Upload screenshots of Instagram Stories or Telegram Charts. Gemini will extract signals automatically.
            </p>
            
            <div className="relative">
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzingImage}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold text-indigo-400 flex items-center justify-center gap-2 transition-colors"
                >
                    {isAnalyzingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isAnalyzingImage ? "Processing Image..." : "Upload Screenshot"}
                </button>
            </div>
            
            {uploadFeedback && (
                <div className={`mt-2 text-[10px] px-2 py-1 rounded ${uploadFeedback.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {uploadFeedback.msg}
                </div>
            )}
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col h-[400px]">
          <div className="p-4 border-b border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                Live Intelligence Feed
              </h3>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded">Real-time</span>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Filter by keyword, ticker, or source..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {filteredNews.length > 0 ? (
              filteredNews.map((item) => (
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
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                       {item.sentiment === 'POSITIVE' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                       {item.sentiment === 'NEGATIVE' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>}
                       <span className="text-[10px] text-slate-600 uppercase">{item.sentiment} Sentiment</span>
                    </div>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                        Read Source <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                No news found matching "{searchQuery}"
              </div>
            )}
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
