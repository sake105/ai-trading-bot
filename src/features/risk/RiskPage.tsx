
import { useCallback, useEffect, useState } from 'react';
import type { PortfolioSnapshot, RiskMetrics } from '../../types/domain';
import { BackendApi } from '../../api/backendApi';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner';
import { ErrorState } from '../../shared/components/ErrorState';
import { RiskSummary } from './components/RiskSummary';
import { SectorExposureChart } from './components/SectorExposureChart';
import { usePolling } from '../../shared/hooks/usePolling';
import { Page } from '../../layout/Page';
import { Button } from '../../shared/components/Button';

export function RiskPage() {
  const [portfolio, setPortfolio] = useState<PortfolioSnapshot | null>(null);
  const [risk, setRisk] = useState<RiskMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [p, r] = await Promise.all([
        BackendApi.getPortfolio(),
        BackendApi.getRisk(),
      ]);
      setPortfolio(p);
      setRisk(r);
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

  usePolling(load, 60000);

  return (
    <Page
      title="Risk"
      subtitle="Risk Summary & Exposures"
      actions={
        <Button variant="ghost" onClick={() => load()} disabled={loading}>
          Refresh
        </Button>
      }
    >
      {loading && !portfolio && !risk && <LoadingSpinner />}
      {error && <ErrorState message={error} />}
      {!error && portfolio && risk && (
        <div className="grid-2">
          <RiskSummary risk={risk} />
          <SectorExposureChart portfolio={portfolio} />
        </div>
      )}
    </Page>
  );
}
