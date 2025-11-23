
import React, { useEffect, useRef } from 'react';
import { PipelineStage, PipelineLog, PipelineArtifact } from '../types';
import { Terminal, CheckCircle2, CircleDashed, XCircle, PlayCircle, AlertTriangle, FileText, Database, Table, FolderOpen } from 'lucide-react';

interface PipelineMonitorProps {
  stage: PipelineStage;
  logs: PipelineLog[];
  artifacts: PipelineArtifact[];
  isRunning: boolean;
  onRun: () => void;
}

const PipelineMonitor: React.FC<PipelineMonitorProps> = ({ stage, logs, artifacts, isRunning, onRun }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getStageIcon = (targetStage: PipelineStage) => {
    const stagesOrder: PipelineStage[] = ['PULL', 'RESAMPLE', 'QC', 'COST', 'EXECUTE', 'BACKTEST', 'PORTFOLIO', 'DONE'];
    const currentIndex = stagesOrder.indexOf(stage);
    const targetIndex = stagesOrder.indexOf(targetStage);

    if (stage === 'ERROR' && targetIndex === currentIndex) return <XCircle className="w-4 h-4 text-rose-500" />;
    if (targetStage === 'DONE') return stage === 'DONE' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <CircleDashed className="w-4 h-4 text-slate-600" />;
    
    if (stage === 'DONE' || currentIndex > targetIndex) return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (currentIndex === targetIndex) return <CircleDashed className="w-4 h-4 text-indigo-400 animate-spin-slow" />;
    return <CircleDashed className="w-4 h-4 text-slate-600" />;
  };

  const getFileIcon = (type: PipelineArtifact['type']) => {
      switch(type) {
          case 'DB': return <Database className="w-3 h-3 text-amber-400" />;
          case 'REPORT': return <FileText className="w-3 h-3 text-blue-400" />;
          case 'FILE': return <Table className="w-3 h-3 text-emerald-400" />;
          default: return <FileText className="w-3 h-3 text-slate-400" />;
      }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      
      {/* Left: Pipeline Visualizer */}
      <div className="lg:col-span-1 bg-slate-900 rounded-xl border border-slate-800 p-5 flex flex-col">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                Orchestrator
            </h3>
            {isRunning && (
                <span className="flex items-center gap-1 text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded animate-pulse">
                    RUNNING
                </span>
            )}
        </div>

        <div className="flex-1 space-y-4 relative pl-2">
            {/* Vertical Line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-800 -z-10"></div>

            {['PULL', 'RESAMPLE', 'QC', 'COST', 'EXECUTE', 'BACKTEST', 'PORTFOLIO'].map((s) => (
                <div key={s} className="flex items-center gap-3">
                    <div className="bg-slate-900 p-1">
                        {getStageIcon(s as PipelineStage)}
                    </div>
                    <div className="flex-1">
                        <span className={`text-xs font-bold ${stage === s ? 'text-indigo-400' : 'text-slate-400'}`}>{s}</span>
                    </div>
                </div>
            ))}
        </div>

        <button 
            onClick={onRun}
            disabled={isRunning}
            className={`mt-6 w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isRunning 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
            }`}
        >
            <PlayCircle className="w-4 h-4" />
            RUN PIPELINE
        </button>
      </div>

      {/* Middle: Terminal Log */}
      <div className="lg:col-span-2 bg-[#0f172a] rounded-xl border border-slate-800 flex flex-col font-mono text-xs shadow-inner">
        <div className="bg-slate-900/50 p-2 border-b border-slate-800 flex items-center gap-2">
            <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
            </div>
            <span className="ml-2 text-slate-500">~/assembled-ai/scripts/run_all_sprint10.ps1</span>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-1 custom-scrollbar">
            {logs.length === 0 && (
                <div className="text-slate-600 italic opacity-50">Ready to execute...</div>
            )}
            {logs.map((log) => (
                <div key={log.id} className="flex gap-2 hover:bg-slate-800/30 p-0.5 rounded">
                    <span className="text-slate-600 shrink-0">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
                    <span className={`font-bold shrink-0 w-16 text-center ${
                        log.stage === 'ERROR' ? 'text-rose-500' : 'text-indigo-400'
                    }`}>[{log.stage}]</span>
                    <span className={`${
                        log.type === 'ERROR' ? 'text-rose-400' : 
                        log.type === 'WARNING' ? 'text-amber-400' :
                        log.type === 'SUCCESS' ? 'text-emerald-400' :
                        'text-slate-300'
                    }`}>
                        {log.type === 'WARNING' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                        {log.message}
                    </span>
                </div>
            ))}
            <div ref={logEndRef} />
        </div>
      </div>

      {/* Right: Artifact Explorer (File Output) */}
      <div className="lg:col-span-1 bg-slate-900 rounded-xl border border-slate-800 flex flex-col">
         <div className="p-4 border-b border-slate-800 bg-slate-950/30 rounded-t-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
               <FolderOpen className="w-4 h-4 text-amber-400" />
               Output Explorer
            </h3>
         </div>
         <div className="flex-1 p-2 overflow-y-auto custom-scrollbar">
            {artifacts.length === 0 ? (
               <div className="text-center py-10 text-slate-600 text-xs">
                  Waiting for output...
               </div>
            ) : (
               <div className="space-y-1">
                  {artifacts.map((file) => (
                     <div key={file.id} className="flex items-center gap-2 p-2 rounded hover:bg-slate-800/50 transition-colors cursor-pointer group animate-in fade-in slide-in-from-left-2">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                           <div className="text-xs text-slate-200 truncate group-hover:text-white font-mono">{file.name}</div>
                           <div className="text-[10px] text-slate-500 truncate">{file.path}</div>
                        </div>
                        <span className="text-[10px] text-slate-600">{file.size}</span>
                     </div>
                  ))}
               </div>
            )}
         </div>
         <div className="p-2 border-t border-slate-800 text-[10px] text-slate-500 text-center">
            Synced with Local Filesystem
         </div>
      </div>

    </div>
  );
};

export default PipelineMonitor;
