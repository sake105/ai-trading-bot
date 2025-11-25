
import { useCallback, useEffect, useState } from 'react';
import type { Event } from '../../types/domain';
import { BackendApi } from '../../api/backendApi';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner';
import { ErrorState } from '../../shared/components/ErrorState';
import { CongressTradesTable } from './components/CongressTradesTable';
import { CongressSectorFlowChart } from './components/CongressSectorFlowChart';
import { Page } from '../../layout/Page';
import { Button } from '../../shared/components/Button';

export function CongressPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await BackendApi.getEvents({ type: 'CONGRESS_TRADE' });
      setEvents(data);
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
      title="Congress"
      subtitle="Politiker-Trades & Sektorfluss"
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
          <CongressTradesTable events={events} />
          <CongressSectorFlowChart events={events} />
        </div>
      )}
    </Page>
  );
}
