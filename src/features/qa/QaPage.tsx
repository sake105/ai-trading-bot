
import { useCallback, useEffect, useState } from 'react';
import type { QaStatus } from '../../types/domain';
import { BackendApi } from '../../api/backendApi';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner';
import { ErrorState } from '../../shared/components/ErrorState';
import { QaPanel } from './components/QaPanel';
import { QaHistoryChart } from './components/QaHistoryChart';
import { Page } from '../../layout/Page';
import { Button } from '../../shared/components/Button';

export function QaPage() {
  const [qa, setQa] = useState<QaStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const q = await BackendApi.getQaStatus();
      setQa(q);
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
      title="QA"
      subtitle="Qualitätssicherung, Backtests & Guards"
      actions={
        <Button variant="ghost" onClick={() => load()} disabled={loading}>
          Refresh
        </Button>
      }
    >
      {loading && !qa && <LoadingSpinner />}
      {error && <ErrorState message={error} />}
      {!error && qa && (
        <div className="grid-2">
          <QaPanel qa={qa} />
          <QaHistoryChart />
        </div>
      )}
    </Page>
  );
}
