
import React, { useState, useEffect } from 'react';
import { AssembledConfig } from '../types';
import { Save, RefreshCw, Zap, Layers, Trash2, Plus, Database, DownloadCloud, Loader2, HardDrive } from 'lucide-react';
import { DataCacheService, DownloadStatus } from '../services/dataCacheService';

interface SettingsProps {
  config: AssembledConfig;
  setConfig: (c: AssembledConfig) => void;
  runSimulation: () => void;
}

const Settings: React.FC<SettingsProps> = ({ config, setConfig, runSimulation }) => {
  const [newTicker, setNewTicker] = useState('');
  const [cacheService] = useState(() => new DataCacheService());
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [storageCount, setStorageCount] = useState(0);

  useEffect(() => {
      cacheService.initDB().then(() => {
          updateStorageStats();
      });
  }, []);

  const updateStorageStats = async () => {
      const count = await cacheService.getStorageUsage();
      setStorageCount(count);
  };

  const handleChange = (key: keyof AssembledConfig, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  const addTicker = () => {
    if (newTicker && !config.watchlist.includes(newTicker.toUpperCase())) {
      const updated = [...config.watchlist, newTicker.toUpperCase()];
      handleChange('watchlist', updated);
      setNewTicker('');
    }
  };

  const removeTicker = (ticker: string) => {
    const updated = config.watchlist.filter(t => t !== ticker);
    handleChange('watchlist', updated);
  };

  const startNightlyDownload = async () => {
      setIsDownloading(true);
      await cacheService.runBatchDownload(config.watchlist, (status) => {
          setDownloadStatus(status);
      });
      setIsDownloading(false);
      updateStorageStats();
  };

  const clearCache = async () => {
      if(confirm("Delete all historical data from local database?")) {
          await cacheService.clearDatabase();
          updateStorageStats();
      }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        
        {/* Data Warehouse / Offline Cache (NEW) */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Database className="w-24 h-24 text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-emerald-400" />
                Data Warehouse (IndexedDB)
            </h3>
            <p className="text-sm text-slate-400 mb-6">
                Download historical data for offline analysis and backtesting. This stores data locally in your browser (Free), bypassing API rate limits during trading hours.
            </p>

            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 font-mono text-xs mb-6">
                <div className="flex justify-between mb-2">
                    <span className="text-slate-500">Storage Status:</span>
                    <span className="text-emerald-400">{storageCount} Tickers Cached</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-slate-500">Database Engine:</span>
                    <span className="text-slate-300">Native IndexedDB</span>
                </div>
                {downloadStatus && (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-white">
                                {downloadStatus.status === 'WAITING' ? 'THROTTLING (Rate Limit Protection)...' : 
                                 downloadStatus.status === 'FETCHING' ? `DOWNLOADING: ${downloadStatus.ticker}` : 
                                 `PROCESSED: ${downloadStatus.ticker}`}
                            </span>
                            {isDownloading && <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />}
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-500 ${
                                    downloadStatus.status === 'WAITING' ? 'bg-amber-500 w-full animate-pulse' : 
                                    downloadStatus.status === 'FAILED' ? 'bg-rose-500 w-full' :
                                    'bg-indigo-500 w-full'
                                }`}
                            ></div>
                        </div>
                        {downloadStatus.error && <p className="text-rose-400 mt-1">{downloadStatus.error}</p>}
                    </div>
                )}
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={startNightlyDownload}
                    disabled={isDownloading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                >
                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
                    {isDownloading ? 'Running Batch Job...' : 'Start Nightly Download'}
                </button>
                <button 
                    onClick={clearCache}
                    disabled={isDownloading}
                    className="px-4 py-2 border border-rose-500/30 text-rose-400 hover:bg-rose-950 rounded-lg text-sm font-bold flex items-center gap-2"
                >
                    <Trash2 className="w-4 h-4" /> Clear
                </button>
            </div>
        </div>

        {/* Watchlist Management */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                Watchlist Manager
                <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">{config.watchlist.length} Assets</span>
            </h3>
            <div className="space-y-4">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={newTicker}
                        onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
                        placeholder="Add Ticker (e.g. IBM)" 
                        className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none flex-1"
                        onKeyDown={(e) => e.key === 'Enter' && addTicker()}
                    />
                    <button 
                        onClick={addTicker}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar p-2 bg-slate-950 rounded border border-slate-800">
                    {config.watchlist.map(ticker => (
                        <div key={ticker} className="flex items-center gap-1 bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded border border-slate-700">
                            {ticker}
                            <button onClick={() => removeTicker(ticker)} className="hover:text-rose-400">
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Risk Mgmt */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-6">Risk Management Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                    <label className="text-sm text-slate-400">Total Account Capital ($)</label>
                    <div className="flex items-center gap-4">
                        <div className="relative w-full">
                            <span className="absolute left-3 top-2 text-slate-500">$</span>
                            <input 
                                type="number" 
                                value={config.initialCapital}
                                onChange={(e) => handleChange('initialCapital', parseFloat(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-4 py-2 text-sm text-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                </div>

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
                </div>

            </div>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-xl border border-indigo-700/50 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-2">Market Engine</h3>
            <p className="text-slate-300 text-sm mb-6">
                Reset market state, clear simulation buffers, and restart the stochastic generators.
            </p>
            <button 
                onClick={runSimulation}
                className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg shadow-indigo-500/20"
            >
                <RefreshCw className="w-5 h-5" />
                Reset Market Data
            </button>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3 text-emerald-400 mb-2">
                <Save className="w-5 h-5" />
                <span className="font-medium">Auto-Save Enabled</span>
            </div>
            <p className="text-xs text-slate-500">
                Changes are applied immediately to the live loop.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
