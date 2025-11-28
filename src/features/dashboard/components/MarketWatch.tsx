
import React, { useState } from 'react';
import type { Signal } from '../../../types/domain';
import { LayoutGrid, List, ChevronUp, ChevronDown, ArrowUpRight, ArrowDownRight, Minus, LineChart, Activity, Brain, Newspaper } from 'lucide-react';
import { CandleChart } from '../../../shared/components/CandleChart';
import { MarketHeatmap } from '../../../shared/components/MarketHeatmap';
import { Card } from '../../../shared/components/Card';

interface Props {
  signals: Signal[];
}

type Tab = 'CHART' | 'TECHNICALS' | 'ANALYSIS' | 'NEWS';
type ViewMode = 'TABLE' | 'HEATMAP';

export function MarketWatch({ signals }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('TABLE');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('CHART');
  const [search, setSearch] = useState('');

  const filtered = signals.filter(s => 
    s.instrument.name.toLowerCase().includes(search.toLowerCase()) || 
    s.instrument.id.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    if (expandedId === id) setExpandedId(null);
    else {
      setExpandedId(id);
      setActiveTab('CHART');
    }
  };

  return (
    <Card title={`Market Watch (${signals.length})`}>
      <div className="flex justify-between mb-4">
        <input 
          type="text" 
          placeholder="Search Ticker..." 
          className="bg-[#171d2b] border border-[#262b3b] rounded px-3 py-1 text-xs text-white focus:border-[#7b5cff] outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex bg-[#171d2b] rounded border border-[#262b3b] p-1">
            <button onClick={() => setViewMode('TABLE')} className={`p-1 rounded ${viewMode === 'TABLE' ? 'bg-[#262b3b] text-white' : 'text-[#9ba4c4]'}`}>
                <List className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('HEATMAP')} className={`p-1 rounded ${viewMode === 'HEATMAP' ? 'bg-[#262b3b] text-white' : 'text-[#9ba4c4]'}`}>
                <LayoutGrid className="w-4 h-4" />
            </button>
        </div>
      </div>

      {viewMode === 'HEATMAP' ? (
        <MarketHeatmap signals={filtered} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead style={{ color: '#9ba4c4', fontSize: 12 }}>
              <tr>
                <th className="p-2">Ticker</th>
                <th className="p-2">Price</th>
                <th className="p-2">Trend</th>
                <th className="p-2">Signal</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <React.Fragment key={s.id}>
                  <tr 
                    onClick={() => toggleExpand(s.id)} 
                    style={{ borderBottom: '1px solid #262b3b', cursor: 'pointer', background: expandedId === s.id ? 'rgba(255,255,255,0.03)' : 'transparent' }}
                  >
                    <td className="p-2 font-bold text-white">
                        {s.instrument.id}
                        <div style={{ fontSize: 10, color: '#9ba4c4', fontWeight: 'normal' }}>{s.instrument.sector}</div>
                    </td>
                    <td className="p-2 font-mono">{(s.entryPrice ?? 0).toFixed(2)} {s.instrument.currency}</td>
                    <td className="p-2">
                        <div className="flex items-center gap-2">
                            <div style={{ width: 40, height: 4, background: '#262b3b', borderRadius: 2 }}>
                                <div style={{ width: `${s.trendScore || 0}%`, height: '100%', background: (s.trendScore || 0) > 50 ? '#3dd68c' : '#ff4d6a', borderRadius: 2 }}></div>
                            </div>
                            <span style={{ fontSize: 10, color: '#9ba4c4' }}>{s.trendScore}</span>
                        </div>
                    </td>
                    <td className="p-2">
                        <span style={{ 
                            fontSize: 10, 
                            padding: '2px 6px', 
                            borderRadius: 4,
                            background: s.direction === 'LONG' ? 'rgba(61, 214, 140, 0.2)' : s.direction === 'SHORT' ? 'rgba(255, 77, 106, 0.2)' : 'rgba(155, 164, 196, 0.15)',
                            color: s.direction === 'LONG' ? '#3dd68c' : s.direction === 'SHORT' ? '#ff4d6a' : '#9ba4c4',
                            fontWeight: 'bold',
                            display: 'inline-flex', alignItems: 'center', gap: 4
                        }}>
                            {s.direction === 'LONG' && <ArrowUpRight className="w-3 h-3" />}
                            {s.direction === 'SHORT' && <ArrowDownRight className="w-3 h-3" />}
                            {s.direction === 'HOLD' && <Minus className="w-3 h-3" />}
                            {s.direction}
                        </span>
                    </td>
                    <td className="p-2 text-center">
                        {expandedId === s.id ? <ChevronUp className="w-4 h-4 text-[#7b5cff]" /> : <ChevronDown className="w-4 h-4 text-[#9ba4c4]" />}
                    </td>
                  </tr>
                  {expandedId === s.id && (
                    <tr>
                        <td colSpan={5} style={{ padding: 0, background: '#0f1219' }}>
                            <div className="flex border-b border-[#262b3b]">
                                {[
                                    { id: 'CHART', icon: LineChart, label: 'Chart' },
                                    { id: 'TECHNICALS', icon: Activity, label: 'Technicals' },
                                    { id: 'ANALYSIS', icon: Brain, label: 'Analysis' },
                                    { id: 'NEWS', icon: Newspaper, label: 'News' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={(e) => { e.stopPropagation(); setActiveTab(tab.id as Tab); }}
                                        style={{
                                            padding: '10px 16px',
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: activeTab === tab.id ? 'white' : '#9ba4c4',
                                            borderBottom: activeTab === tab.id ? '2px solid #7b5cff' : '2px solid transparent',
                                            display: 'flex', alignItems: 'center', gap: 6
                                        }}
                                    >
                                        <tab.icon className="w-3 h-3" /> {tab.label}
                                    </button>
                                ))}
                            </div>
                            <div style={{ padding: 16, minHeight: 300 }}>
                                {activeTab === 'CHART' && <CandleChart ticker={s.instrument.id} />}
                                {activeTab === 'TECHNICALS' && (
                                    <div className="grid grid-cols-2 gap-4 text-xs text-[#9ba4c4]">
                                        <div>RSI: <span className="text-white">{(s.rsi ?? 0).toFixed(1)}</span></div>
                                        <div>Vol: <span className="text-white">{(s.volume || 0).toLocaleString()}</span></div>
                                        <div>Composite: <span className="text-[#7b5cff]">{s.compositeScore}</span></div>
                                    </div>
                                )}
                            </div>
                        </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
