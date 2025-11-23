
import React from 'react';
import { CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

// Mock Data Type for this view (will eventually come from Domain)
interface CongressTrade {
    id: string;
    politician: string;
    party: 'Democrat' | 'Republican';
    chamber: 'Senate' | 'House';
    ticker: string;
    sector: string;
    type: 'Purchase' | 'Sale';
    amount: string; // e.g. "$50k - $100k"
    disclosureDelayDays: number;
    conflictFlag: boolean;
}

const MOCK_TRADES: CongressTrade[] = [
    { id: '1', politician: 'Nancy Pelosi', party: 'Democrat', chamber: 'House', ticker: 'NVDA', sector: 'Technology', type: 'Purchase', amount: '$1M - $5M', disclosureDelayDays: 2, conflictFlag: false },
    { id: '2', politician: 'Tommy Tuberville', party: 'Republican', chamber: 'Senate', ticker: 'CLF', sector: 'Basic Materials', type: 'Sale', amount: '$100k - $250k', disclosureDelayDays: 45, conflictFlag: true },
    { id: '3', politician: 'Ro Khanna', party: 'Democrat', chamber: 'House', ticker: 'LMT', sector: 'Defense', type: 'Purchase', amount: '$15k - $50k', disclosureDelayDays: 1, conflictFlag: false },
];

export const CongressTradesTable: React.FC = () => {
    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950 text-slate-400 font-medium text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4">Politician</th>
                            <th className="px-6 py-4">Asset</th>
                            <th className="px-6 py-4">Action</th>
                            <th className="px-6 py-4">Volume</th>
                            <th className="px-6 py-4">Lag (Days)</th>
                            <th className="px-6 py-4">Flags</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {MOCK_TRADES.map(t => (
                            <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-white">{t.politician}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`w-2 h-2 rounded-full ${t.party === 'Democrat' ? 'bg-blue-500' : 'bg-red-500'}`}></span>
                                        <span className="text-xs text-slate-500">{t.party} ({t.chamber})</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-mono font-bold text-indigo-300">{t.ticker}</span>
                                    <div className="text-xs text-slate-500">{t.sector}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${t.type === 'Purchase' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                        {t.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-300 font-mono text-xs">
                                    {t.amount}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`font-bold ${t.disclosureDelayDays > 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                        {t.disclosureDelayDays}d
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {t.conflictFlag ? (
                                        <div className="flex items-center gap-1 text-amber-400 text-xs" title="Committee Conflict Potential">
                                            <AlertTriangle className="w-4 h-4" /> Conflict
                                        </div>
                                    ) : (
                                        <span className="text-slate-600 text-xs">-</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
