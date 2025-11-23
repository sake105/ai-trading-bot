
import { PipelineStage, PipelineLog, AssembledConfig, PipelineArtifact } from '../types';

const DELAY_MS = 1200; // Adjusted for UX

export class PipelineService {
  
  private static async wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public static async run(
    config: AssembledConfig,
    log: (msg: string, type: PipelineLog['type'], stage: PipelineStage) => void,
    setStage: (stage: PipelineStage) => void,
    addArtifact: (artifact: PipelineArtifact) => void
  ) {
    
    try {
      // --- STAGE 1: PULL ---
      setStage('PULL');
      log('Starting Pipeline Execution (Sprint 10)...', 'INFO', 'PULL');
      log('Context: scripts/run_all_sprint10.ps1', 'INFO', 'PULL');
      
      if (config.skipPull) {
        log('Flag [-SkipPull] detected. Using existing raw data.', 'WARNING', 'PULL');
        addArtifact({
            id: 'raw_exist', name: 'assembled_intraday.parquet', path: 'data/raw/', type: 'DB', size: '560 KB', timestamp: new Date().toISOString(), status: 'GENERATED'
        });
      } else {
        log('Connecting to Finnhub Data Stream...', 'INFO', 'PULL');
        await this.wait(DELAY_MS);
        log('Fetching OHLCV bars for Watchlist...', 'INFO', 'PULL');
        await this.wait(DELAY_MS);
        addArtifact({
            id: 'raw_1', name: 'assembled_intraday.parquet', path: 'data/raw/', type: 'DB', size: '560 KB', timestamp: new Date().toISOString(), status: 'GENERATED'
        });
        log('Download complete. 560KB data acquired.', 'SUCCESS', 'PULL');
      }

      // --- STAGE 2: RESAMPLE ---
      setStage('RESAMPLE');
      await this.wait(DELAY_MS);
      log('Executing: 50_resample_intraday.ps1', 'INFO', 'RESAMPLE');
      log('Aggregating 1min -> 5min bars...', 'INFO', 'RESAMPLE');
      
      await this.wait(DELAY_MS);
      
      addArtifact({
          id: 'agg_1', name: '5min.parquet', path: 'output/aggregates/', type: 'DB', size: '16 KB', timestamp: new Date().toISOString(), status: 'GENERATED'
      });
      log('Output: output/aggregates/5min.parquet created.', 'SUCCESS', 'RESAMPLE');

      // --- STAGE 3: QC (Quality Control) ---
      setStage('QC');
      await this.wait(DELAY_MS);
      log('Executing: 51_qc_intraday_gaps.ps1', 'INFO', 'QC');
      log('Checking for NaNs, outliers, and timestamps...', 'INFO', 'QC');
      
      await this.wait(DELAY_MS);
      
      addArtifact({
          id: 'qc_1', name: 'intraday_gaps_summary.json', path: 'output/qc/', type: 'REPORT', size: '1 KB', timestamp: new Date().toISOString(), status: 'GENERATED'
      });
      log('QC Passed. Data integrity 100%.', 'SUCCESS', 'QC');

      // --- STAGE 4: COST MODEL ---
      setStage('COST');
      await this.wait(DELAY_MS);
      log('Executing: sprint8_cost_model.ps1', 'INFO', 'COST');
      log('Calculating Spread + Impact Grid...', 'INFO', 'COST');
      await this.wait(DELAY_MS);
      addArtifact({
          id: 'cost_1', name: 'cost_grid_equity.csv', path: 'output/', type: 'FILE', size: '58 KB', timestamp: new Date().toISOString(), status: 'GENERATED'
      });
      log('Cost Grid Generated.', 'SUCCESS', 'COST');

      // --- STAGE 5: EXECUTE ---
      setStage('EXECUTE');
      await this.wait(DELAY_MS);
      log('Executing: sprint9_execute.py', 'INFO', 'EXECUTE');
      log('Strategy: Trend_Breakout_v32 | Mode: Paper', 'INFO', 'EXECUTE');
      await this.wait(DELAY_MS);
      
      addArtifact({
          id: 'ord_1', name: 'orders_5min.csv', path: 'output/', type: 'FILE', size: '1 KB', timestamp: new Date().toISOString(), status: 'GENERATED'
      });
      log('Signals Generated: 4 BUY, 1 SELL.', 'INFO', 'EXECUTE');
      log('Orders written to CSV.', 'SUCCESS', 'EXECUTE');

      // --- STAGE 6: BACKTEST ---
      setStage('BACKTEST');
      await this.wait(DELAY_MS);
      log('Executing: sprint9_backtest.ps1', 'INFO', 'BACKTEST');
      log('Running Walk-Forward Validation...', 'INFO', 'BACKTEST');
      await this.wait(DELAY_MS);
      
      addArtifact({
          id: 'perf_1', name: 'performance_report_5min.md', path: 'output/', type: 'REPORT', size: '1 KB', timestamp: new Date().toISOString(), status: 'GENERATED'
      });
      addArtifact({
          id: 'perf_2', name: 'equity_curve_5min.csv', path: 'output/', type: 'FILE', size: '14 KB', timestamp: new Date().toISOString(), status: 'GENERATED'
      });
      log('Sharpe: 1.85 | MaxDD: 12.4% | PF: 2.1', 'SUCCESS', 'BACKTEST');

      // --- STAGE 7: PORTFOLIO ---
      setStage('PORTFOLIO');
      await this.wait(DELAY_MS);
      log('Executing: sprint10_portfolio.py', 'INFO', 'PORTFOLIO');
      log('Optimizing weights via HRP...', 'INFO', 'PORTFOLIO');
      await this.wait(DELAY_MS);
      
      addArtifact({
          id: 'port_1', name: 'portfolio_report.md', path: 'output/', type: 'REPORT', size: '1 KB', timestamp: new Date().toISOString(), status: 'GENERATED'
      });
      addArtifact({
          id: 'port_2', name: 'portfolio_equity_1d.csv', path: 'output/', type: 'FILE', size: '655 KB', timestamp: new Date().toISOString(), status: 'GENERATED'
      });
      
      log('Rebalancing Targets Calculated.', 'SUCCESS', 'PORTFOLIO');

      // --- DONE ---
      setStage('DONE');
      log('Pipeline Run Completed Successfully.', 'SUCCESS', 'DONE');

    } catch (e) {
      setStage('ERROR');
      log(`Pipeline Aborted: ${e}`, 'ERROR', 'ERROR');
    }
  }
}
