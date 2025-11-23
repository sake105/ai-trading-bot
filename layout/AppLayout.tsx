
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Activity, 
  LineChart, 
  Newspaper, 
  Landmark, 
  Anchor, 
  Settings,
  Play,
  Pause
} from 'lucide-react';

interface Props {
  children: React.ReactNode;
  isLive: boolean;
  toggleLive: () => void;
}

export const AppLayout: React.FC<Props> = ({ children, isLive, toggleLive }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/orders', label: 'Orders (SAFE)', icon: ShieldCheck },
    { path: '/risk', label: 'Risk View', icon: Activity },
    { path: '/qa', label: 'QA Cockpit', icon: FileBarChart },
    { path: '/events', label: 'News & Events', icon: Newspaper },
    { path: '/congress', label: 'Congress Trading', icon: Landmark },
    { path: '/shipping', label: 'Global Shipping', icon: Anchor },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
           <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-slate-900 text-xl transition-colors ${isLive ? 'bg-rose-500' : 'bg-emerald-500'}`}>
             A
           </div>
           <span className="font-bold text-lg tracking-tight">ASSEMBLED AI</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const isActive = currentPath === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 mb-4">
              <div className="flex justify-between items-center mb-1">
                 <span className="text-xs text-slate-500 uppercase">Core Status</span>
                 <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
              </div>
              <p className={`text-sm font-mono font-bold ${isLive ? 'text-rose-400' : 'text-emerald-400'}`}>
                 {isLive ? 'LIVE TRADING' : 'STANDBY'}
              </p>
           </div>
           <button 
             onClick={toggleLive}
             className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-colors border ${
                isLive 
                ? 'bg-rose-600/10 text-rose-400 border-rose-500/50 hover:bg-rose-600 hover:text-white' 
                : 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500'
             }`}
           >
             {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
             {isLive ? 'STOP ENGINE' : 'START ENGINE'}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

import { FileBarChart } from 'lucide-react';
