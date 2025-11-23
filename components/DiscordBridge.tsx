
import React, { useState } from 'react';
import { Webhook, Send, Settings, Activity, BarChart3, Check } from 'lucide-react';
import { AssembledConfig } from '../types';

interface DiscordBridgeProps {
  config: AssembledConfig;
  setConfig: (c: AssembledConfig) => void;
}

const DiscordBridge: React.FC<DiscordBridgeProps> = ({ config, setConfig }) => {
  const [testStatus, setTestStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');

  // NOTE: This is the webhook provided by the user. 
  // Ideally, this should be masked in a real production environment.
  const handleWebhookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, discordWebhookUrl: e.target.value });
  };

  const sendTestMessage = async () => {
    if (!config.discordWebhookUrl) return;
    
    setTestStatus('SENDING');
    
    const payload = {
      content: "🤖 **ASSEMBLED SYSTEM CONNECTION TEST**",
      embeds: [
        {
          title: "System Online",
          description: "The trading dashboard has successfully connected to this Discord channel. Live signals will appear here.",
          color: 5814783, // Hex #58b9ff converted to decimal
          fields: [
            { name: "Status", value: "✅ Active", inline: true },
            { name: "Latency", value: "24ms", inline: true },
            { name: "Regime", value: "NEUTRAL", inline: true }
          ],
          footer: { text: "Assembled Trading AI v32" },
          timestamp: new Date().toISOString()
        }
      ]
    };

    try {
      const response = await fetch(config.discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setTestStatus('SUCCESS');
        setTimeout(() => setTestStatus('IDLE'), 3000);
      } else {
        setTestStatus('ERROR');
      }
    } catch (error) {
      console.error(error);
      setTestStatus('ERROR');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Configuration Panel */}
      <div className="space-y-6">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
           <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-400" />
              Bot Configuration
           </h3>
           
           <div className="space-y-4">
              <div className="space-y-2">
                 <label className="text-sm text-slate-400">Discord Webhook URL</label>
                 <div className="flex gap-2">
                    <input 
                       type="text" 
                       value={config.discordWebhookUrl || ''}
                       onChange={handleWebhookChange}
                       placeholder="https://discord.com/api/webhooks/..."
                       className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                 </div>
                 <p className="text-[10px] text-slate-500">Paste the Webhook URL from your Discord Server Integration settings.</p>
              </div>

              <div className="pt-4 space-y-3 border-t border-slate-800">
                 <p className="text-xs font-bold text-slate-500 uppercase mb-2">Notification Triggers</p>
                 <label className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                    <span className="text-sm text-slate-300">Trade Entries & Exits</span>
                    <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4" />
                 </label>
                 <label className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                    <span className="text-sm text-slate-300">Daily PnL Report</span>
                    <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4" />
                 </label>
                 <label className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                    <span className="text-sm text-slate-300">Intelligence / News Alerts</span>
                    <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4" />
                 </label>
                 <label className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                    <span className="text-sm text-slate-300">Backtest & Chart Screenshots</span>
                    <input type="checkbox" className="accent-emerald-500 w-4 h-4" />
                 </label>
              </div>

              <button 
                onClick={sendTestMessage}
                disabled={testStatus === 'SENDING'}
                className={`w-full mt-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  testStatus === 'SUCCESS' ? 'bg-emerald-500 text-white' :
                  testStatus === 'ERROR' ? 'bg-rose-500 text-white' :
                  'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {testStatus === 'SENDING' ? <Activity className="w-4 h-4 animate-spin" /> : 
                 testStatus === 'SUCCESS' ? <Check className="w-4 h-4" /> : 
                 <Webhook className="w-4 h-4" />}
                {testStatus === 'SENDING' ? 'Sending...' : 
                 testStatus === 'SUCCESS' ? 'Test Sent!' : 
                 testStatus === 'ERROR' ? 'Connection Failed' :
                 'Send Test Signal'}
              </button>
           </div>
        </div>
      </div>

      {/* Live Preview Area */}
      <div className="bg-[#313338] rounded-xl border border-slate-900 overflow-hidden shadow-2xl flex flex-col h-[600px]">
         <div className="bg-[#2b2d31] p-3 flex items-center justify-between border-b border-[#1e1f22]">
            <div className="flex items-center gap-2">
               <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-[10px] text-white font-bold">#</div>
               <span className="text-white font-bold text-sm">trading-signals</span>
            </div>
            <Settings className="w-4 h-4 text-slate-400" />
         </div>

         <div className="flex-1 p-4 space-y-6 overflow-y-auto font-sans">
            
            {/* Mock Message 1: Buy Signal */}
            <div className="flex gap-3 group">
               <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-white font-bold text-xs">AI</span>
               </div>
               <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-emerald-400 font-medium text-sm hover:underline cursor-pointer">Assembled Bot</span>
                     <span className="bg-[#5865f2] text-[10px] text-white px-1 rounded">BOT</span>
                     <span className="text-xs text-slate-400">Today at 09:30 AM</span>
                  </div>
                  <div className="border-l-4 border-emerald-500 bg-[#2b2d31] rounded p-3 max-w-md">
                     <h4 className="text-white font-bold mb-1">🚀 ENTRY SIGNAL: NVDA</h4>
                     <p className="text-slate-300 text-sm mb-3">Strong momentum detected with institutional volume support.</p>
                     <div className="grid grid-cols-2 gap-y-2 text-xs">
                        <div>
                           <p className="text-slate-400">Entry Price</p>
                           <p className="text-white font-mono">$845.20</p>
                        </div>
                        <div>
                           <p className="text-slate-400">Stop Loss</p>
                           <p className="text-white font-mono">$820.00</p>
                        </div>
                        <div>
                           <p className="text-slate-400">Trend Score</p>
                           <p className="text-emerald-400 font-mono">92/100</p>
                        </div>
                        <div>
                           <p className="text-slate-400">News Sentiment</p>
                           <p className="text-emerald-400 font-mono">POSITIVE</p>
                        </div>
                     </div>
                     <div className="mt-3 pt-2 border-t border-slate-700 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-400">Strategy: Trend_Breakout_v32</span>
                     </div>
                  </div>
               </div>
            </div>

             {/* Mock Message 2: PnL Report */}
             <div className="flex gap-3 group">
               <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-white font-bold text-xs">AI</span>
               </div>
               <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-emerald-400 font-medium text-sm hover:underline cursor-pointer">Assembled Bot</span>
                     <span className="bg-[#5865f2] text-[10px] text-white px-1 rounded">BOT</span>
                     <span className="text-xs text-slate-400">Today at 04:05 PM</span>
                  </div>
                  <div className="border-l-4 border-blue-500 bg-[#2b2d31] rounded p-3 max-w-md">
                     <h4 className="text-white font-bold mb-1">📊 DAILY CLOSE REPORT</h4>
                     <p className="text-slate-300 text-sm mb-3">Summary of trading activity for Oct 14, 2025</p>
                     <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                           <span className="text-slate-400">Daily PnL</span>
                           <span className="text-emerald-400 font-mono font-bold">+$1,240.50</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-slate-400">Trades Executed</span>
                           <span className="text-white font-mono">5 (3 Win / 2 Loss)</span>
                        </div>
                         <div className="flex justify-between">
                           <span className="text-slate-400">Exposure</span>
                           <span className="text-white font-mono">65% Long / 35% Cash</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

         </div>

         <div className="p-4 bg-[#2b2d31] flex items-center gap-3">
            <div className="w-full bg-[#383a40] h-10 rounded-lg flex items-center px-4 text-slate-500 text-sm">
               Message #trading-signals is read-only for bot
            </div>
            <div className="w-10 h-10 bg-[#383a40] rounded-lg flex items-center justify-center">
               <Send className="w-5 h-5 text-slate-500" />
            </div>
         </div>
      </div>

    </div>
  );
};

export default DiscordBridge;
