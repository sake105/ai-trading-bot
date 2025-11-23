
import React from 'react';
import { OrderPreview } from '../../../types/domain';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface Props {
  orders: OrderPreview[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const OrdersTable: React.FC<Props> = ({ orders, onApprove, onReject }) => {
  if (!orders.length) {
    return (
        <div className="p-10 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
            <p className="text-slate-500">No pending orders in SAFE-Bridge.</p>
        </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-slate-900 rounded-xl border border-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-950 text-slate-400 font-medium">
          <tr>
            <th className="px-6 py-4">Ticker</th>
            <th className="px-6 py-4">Side</th>
            <th className="px-6 py-4">Qty</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Cost (Est)</th>
            <th className="px-6 py-4">Rationale</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {orders.map(o => (
            <tr key={o.id} className="hover:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4 font-mono font-bold text-white">{o.instrument.id}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${o.side === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {o.side}
                </span>
              </td>
              <td className="px-6 py-4 font-mono">{o.quantity}</td>
              <td className="px-6 py-4 text-slate-400 text-xs">{o.type} @ {o.limitPrice}</td>
              <td className="px-6 py-4 font-mono">${o.estimatedCost.toLocaleString()}</td>
              <td className="px-6 py-4 text-xs text-slate-300 max-w-xs truncate" title={o.comment}>
                {o.comment}
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button 
                    onClick={() => onApprove(o.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                    <CheckCircle2 className="w-3 h-3" /> Approve
                </button>
                <button 
                    onClick={() => onReject(o.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition-colors"
                >
                    <XCircle className="w-3 h-3" /> Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
