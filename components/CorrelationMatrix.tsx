
import React from 'react';
import { AssetSignal } from '../types';
import { GitGraph } from 'lucide-react';

interface CorrelationMatrixProps {
  signals: AssetSignal[];
}

const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({ signals }) => {
  const activeAssets = signals.slice(0, 6); // Limit to top 6 for clean grid

  const getCorrelation = (asset1: AssetSignal, asset2: AssetSignal) => {
    if (asset1.ticker === asset2.ticker) return 1.0;
    // Mock correlation logic based on Sector similarity
    // In production, this would calculate Pearson coefficient of historical returns
    if (asset1.sector === asset2.sector) return 0.85; // High correlation in same sector
    if (asset1.sector === 'Index' || asset2.sector === 'Index') return 0.65; // High beta to market
    return 0.25; // Low correlation otherwise
  };

  const getColor = (val: number) => {
    if (val === 1) return 'bg-slate-800 text-slate-500';
    if (val > 0.7) return 'bg-rose-500/20 text-rose-400 font-bold';
    if (val > 0.4) return 'bg-amber-500/20 text-amber-400';
    return 'bg-emerald-500/20 text-emerald-400';
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 overflow-hidden">
      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <GitGraph className="h-5 w-5 text-indigo-400" />
        Portfolio Correlation Matrix
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="p-2"></th>
              {activeAssets.map(a => (
                <th key={a.ticker} className="p-2 text-slate-400 font-mono">{a.ticker}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeAssets.map((rowAsset) => (
              <tr key={rowAsset.ticker}>
                <td className="p-2 font-mono text-slate-400 font-bold">{rowAsset.ticker}</td>
                {activeAssets.map((colAsset) => {
                  const corr = getCorrelation(rowAsset, colAsset);
                  return (
                    <td key={colAsset.ticker} className="p-1 text-center">
                      <div className={`w-full h-8 rounded flex items-center justify-center ${getColor(corr)}`}>
                        {corr.toFixed(2)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-slate-500 mt-3">
        <span className="text-rose-400 font-bold">Red</span> = High risk of simultaneous drawdown. <span className="text-emerald-400 font-bold">Green</span> = Good diversification benefit.
      </p>
    </div>
  );
};

export default CorrelationMatrix;
