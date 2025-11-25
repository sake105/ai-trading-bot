
import { useCallback, useEffect, useState } from 'react';
import type { Event } from '../../types/domain';
import { BackendApi } from '../../api/backendApi';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner';
import { ErrorState } from '../../shared/components/ErrorState';
import { EventsTimeline } from './components/EventsTimeline';
import { Page } from '../../layout/Page';
import { Button } from '../../shared/components/Button';

type FilterType =
  | 'ALL'
  | 'COMPANY_NEWS'
  | 'MACRO'
  | 'POLITICAL'
  | 'LEGISLATION'
  | 'SHIPPING'
  | 'CONGRESS_TRADE';

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('ALL');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const typeParam = filter === 'ALL' ? undefined : filter;
      const all = await BackendApi.getEvents(
        typeParam ? { type: typeParam } : undefined,
      );
      setEvents(all);
      setError(null);
    } catch (e: any) {
      console.error(e);
      setError(e.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Page
      title="News & Events"
      subtitle="Fundamentale & alternative Signale"
      actions={
        <>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            style={{
              background: 'var(--surface-alt)',
              color: 'var(--text)',
              borderRadius: 6,
              border: '1px solid var(--border)',
              padding: '4px 8px',
              fontSize: 12,
              marginRight: 8,
            }}
          >
            <option value="ALL">Alle</option>
            <option value="COMPANY_NEWS">Company</option>
            <option value="MACRO">Macro</option>
            <option value="POLITICAL">Political</option>
            <option value="LEGISLATION">Legislation</option>
            <option value="SHIPPING">Shipping</option>
            <option value="CONGRESS_TRADE">Congress</option>
          </select>
          <Button variant="ghost" onClick={() => load()} disabled={loading}>
            Refresh
          </Button>
        </>
      }
    >
      {loading && <LoadingSpinner />}
      {error && <ErrorState message={error} />}
      {!loading && !error && <EventsTimeline events={events} />}
    </Page>
  );
}
