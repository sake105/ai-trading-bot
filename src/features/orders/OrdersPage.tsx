
import { useOrders } from './hooks/useOrders';
import { OrdersTable } from './components/OrdersTable';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner';
import { ErrorState } from '../../shared/components/ErrorState';
import { Page } from '../../layout/Page';
import { Button } from '../../shared/components/Button';
import { Skeleton } from '../../shared/components/Skeleton';

export function OrdersPage() {
  const { orders, loading, error, processingId, approve, reject, refresh } = useOrders();

  return (
    <Page
      title="Orders"
      subtitle="SAFE-Bridge · Orders aus AI-Signalen"
      actions={
        <Button variant="ghost" onClick={() => refresh()} disabled={loading}>
          Refresh
        </Button>
      }
    >
      {loading && !orders.length && (
        <div>
          <Skeleton height={18} />
          <Skeleton height={18} />
          <Skeleton height={18} />
        </div>
      )}
      {error && <ErrorState message={error} />}
      {!loading && !error && (
        <OrdersTable
          orders={orders}
          processingId={processingId}
          onApprove={approve}
          onReject={reject}
        />
      )}
      {loading && !!orders.length && <LoadingSpinner />}
    </Page>
  );
}
