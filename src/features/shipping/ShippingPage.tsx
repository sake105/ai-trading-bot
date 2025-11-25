
import { useCallback, useEffect, useState } from 'react';
import type { Event, PortfolioSnapshot } from '../../types/domain';
import { BackendApi } from '../../api/backendApi';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner';
import { ErrorState } from '../../shared/components/ErrorState';
import { ShippingStressChart } from './components/ShippingStressChart';
import { RouteExposureList } from './components/RouteExposureList';
import { Page } from '../../layout/Page';
import { Button } from '../../shared/components/Button';

export function ShippingPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [ev, pf] = await Promise.all([
        BackendApi.getEvents({ type: 'SHIPPING' }),
        BackendApi.getPortfolio(),
      ]);
      setEvents(ev);
      setPortfolio(pf);
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

  return (
    <Page
      title="Shipping"
      subtitle="Routen-Stress & Portfolio-Exposure"
      actions={
        <Button variant="ghost" onClick={() => load()} disabled={loading}>
          Refresh
        </Button>
      }
    >
      {loading && <LoadingSpinner />}
      {error && <ErrorState message={error} />}
      {!loading && !error && (
        <div className="grid-2">
          <ShippingStressChart events={events} />
          <RouteExposureList portfolio={portfolio} />
        </div>
      )}
    </Page>
  );
}
