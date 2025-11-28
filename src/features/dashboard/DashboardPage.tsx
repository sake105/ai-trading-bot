
import { useCallback, useEffect, useState } from 'react';
import { BackendApi } from '../../api/backendApi';
import type {
  PortfolioSnapshot,
  RiskMetrics,
  QaStatus,
  Signal
} from '../../types/domain';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner';
import { ErrorState } from '../../shared/components/ErrorState';
import { PnLChart } from './components/PnLChart';
import { EquityCurve } from './components/EquityCurve';
import { ExposureSummary } from './components/ExposureSummary';
import { MarketWatch } from './components/MarketWatch';
import { StrategyAgent } from './components/StrategyAgent';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { formatPercent } from '../../shared/utils/formatters';
import { usePolling } from '../../shared/hooks/usePolling';
import { Page } from '../../layout/Page';
import { Button } from '../../shared/components/Button';
import { Skeleton } from '../../shared/components/Skeleton';
import { useWebSocket } from '../../shared/hooks/useWebSocket';
import { WS_URL } from '../../config/env';

export function DashboardPage() {
  const [portfolio, setPortfolio] = useState<PortfolioSnapshot | null>(null);
  const [risk, setRisk] = useState<RiskMetrics | null>(null);
  const [qa, setQa] = useState<QaStatus | null>(null);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      // Parallel fetch for speed
      const [p, r, q, s] = await Promise.all([
        BackendApi.getPortfolio(),
        BackendApi.getRisk(),
        BackendApi.getQaStatus(),
        BackendApi.getSignals()
      ]);
      setPortfolio(p);
      setRisk(r);
      setQa(q);
      setSignals(s);
      setError(null);
    } catch (e: any) {
      console.error(e);
      setError(e.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Auto-Refresh every 60s
  usePolling(load, 60000);

  // Live-Updates via WebSocket (optional)
  useWebSocket(WS_URL || null, {
    onMessage: (msg: any) => {
      if (!msg || typeof msg !== 'object') return;
      if (msg.type === 'portfolio_update' && msg.payload) {
        setPortfolio(msg.payload as PortfolioSnapshot);
      } else if (msg.type === 'risk_update' && msg.payload) {
        setRisk(msg.payload as RiskMetrics);
      } else if (msg.type === 'qa_update' && msg.payload) {
        setQa(msg.payload as QaStatus);
      }
    },
  });

  if (loading && !portfolio) {
    return (
      <Page title="Dashboard" subtitle="Cockpit für Handel, Risk & QA">
        <div className="grid gap-6">
          <Skeleton height={200} />
          <Skeleton height={400} />
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Dashboard" subtitle="Cockpit für Handel, Risk & QA">
        <ErrorState message={error} />
      </Page>
    );
  }

  if (!portfolio || !risk || !qa) {
    return (
      <Page title="Dashboard" subtitle="Cockpit für Handel, Risk & QA">
        <ErrorState message="Keine Daten vom Backend erhalten." />
      </Page>
    );
  }

  const qaColor =
    qa.canTradeToday && qa.dataOk && qa.leakageRisk === 'OK' && qa.modelDrift === 'OK'
      ? 'green'
      : qa.leakageRisk === 'BLOCK' || qa.modelDrift === 'BLOCK'
      ? 'red'
      : 'yellow';

  return (
    <Page
      title="Dashboard"
      subtitle="Cockpit für Handel, Risk, QA & Events"
      actions={
        <Button variant="ghost" onClick={() => load()} disabled={loading}>
          Refresh
        </Button>
      }
    >
      {/* Top Row: Strategy AI */}
      <StrategyAgent />

      {/* Middle Row: Stats & Charts */}
      <div className="grid-3">
        <PnLChart
          history={portfolio.pnlHistory1M}
          pnl1D={portfolio.realizedPnl1D}
          pnlYtd={portfolio.realizedPnlYtd}
        />
        <EquityCurve
          equity={portfolio.equity}
          cash={portfolio.cash}
          history={portfolio.equityHistory}
        />
        <Card title="Risk & QA">
          <div>Volatility (ann.): {formatPercent(risk.volatilityAnn)}</div>
          <div>Max Drawdown: {formatPercent(risk.maxDrawdown)}</div>
          <div>Net Exposure: {formatPercent(risk.netExposure)}</div>
          <div style={{ marginTop: 10 }}>
            QA-Status:{' '}
            <Badge color={qaColor as any} label={qa.canTradeToday ? 'OK' : 'BLOCKED'} />
          </div>
        </Card>
      </div>
      
      {/* Bottom Row: Exposure & Market Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
           <ExposureSummary positions={portfolio.positions} />
        </div>
        <div className="lg:col-span-2">
           <MarketWatch signals={signals} />
        </div>
      </div>
    </Page>
  );
}
