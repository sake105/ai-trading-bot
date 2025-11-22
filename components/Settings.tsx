import React from 'react';
import { AssembledConfig } from '../types';
import { Save, RefreshCw } from 'lucide-react';

interface SettingsProps {
  config: AssembledConfig;
  setConfig: (c: AssembledConfig) => void;
  runSimulation: () => void;
}

const Settings: React.FC<SettingsProps> = ({ config, setConfig, runSimulation }) => {
  
  const handleChange = (key: keyof AssembledConfig, value: string | number | boolean) => {
    setConfig({ ...config, [key]: value });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-6">Risk Management Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                    <label className="text-sm text-slate-400">Target Volatility (Annualized)</label>
                    <div className="flex items-center gap-4">
                        <input 
                            type="range" 
                            min="0.05" max="0.25" step="0.01"
                            value={config.volTarget}
                            onChange={(e) => handleChange('volTarget', parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <span className="text-white font-mono w-16">{(config.volTarget * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-xs text-slate-500">Controls position sizing based on asset volatility.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-slate-400">Kelly Criterion Scale</label>
                    <div className="flex items-center gap-4">
                        <input 
                            type="range" 
                            min="0.1" max="1.0" step="0.1"
                            value={config.kellyScale}
                            onChange={(e) => handleChange('kellyScale', parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <span className="text-white font-mono w-16">{config.kellyScale.toFixed(1)}x</span>
                    </div>
                    <p className="text-xs text-slate-500">Fractional Kelly to reduce drawdown variance.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-slate-400">ATR Stop Multiplier</label>
                    <input 
                        type="number"
                        step="0.1"
                        value={config.atrStopMultiplier}
                        onChange={(e) => handleChange('atrStopMultiplier', parseFloat(e.target.value))}
                        className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg block w-full p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                 <div className="space-y-2">
                    <label className="text-sm text-slate-400">Gemini API Key</label>
                    <input 
                        type="password"
                        placeholder="Enter your API Key"
                        value={config.apiKey || ''}
                        onChange={(e) => handleChange('apiKey', e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg block w-full p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-xs text-slate-500">Required for AI Analyst (Optional).</p>
                </div>

            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-4">Optimization Logic</h3>
            <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-800/30">
                <div>
                    <h4 className="text-white font-medium">HRP + CVaR Optimization</h4>
                    <p className="text-xs text-slate-400">Use Hierarchical Risk Parity with Conditional Value-at-Risk tails.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={config.useHRP} 
                        onChange={(e) => handleChange('useHRP', e.target.checked)}
                        className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-xl border border-indigo-700/50 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-2">Simulation Engine</h3>
            <p className="text-slate-300 text-sm mb-6">
                Running the simulation will re-calculate signals, regime detection, and backtest metrics based on the parameters on the left.
            </p>
            <button 
                onClick={runSimulation}
                className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg shadow-indigo-500/20"
            >
                <RefreshCw className="w-5 h-5" />
                Run Full Pipeline
            </button>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3 text-emerald-400 mb-2">
                <Save className="w-5 h-5" />
                <span className="font-medium">Auto-Save Enabled</span>
            </div>
            <p className="text-xs text-slate-500">
                Configuration is stored in local state for the duration of the session. 
                Export to <code className="bg-slate-800 px-1 rounded text-slate-300">config.yaml</code> available in Production mode.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
