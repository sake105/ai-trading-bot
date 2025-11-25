
import { useCallback, useEffect, useState } from 'react';
import type { OrderPreview } from '../../../types/domain';
import { BackendApi } from '../../../api/backendApi';
import { useToast } from '../../../shared/toast/useToast';
import { usePolling } from '../../../shared/hooks/usePolling';

export function useOrders() {
  const [orders, setOrders] = useState<OrderPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { showToast } = useToast();

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await BackendApi.getOrderPreviews();
      setOrders(data);
      setError(null);
    } catch (e: any) {
      console.error(e);
      setError(e.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Auto-Refresh alle 30s
  usePolling(refresh, 30000);

  async function approve(id: string) {
    try {
      setProcessingId(id);
      await BackendApi.approveOrder(id);
      showToast('Order approved', 'success');
      await refresh();
    } catch (e: any) {
      console.error(e);
      showToast(`Approve failed: ${e.message ?? 'Unknown error'}`, 'error');
    } finally {
      setProcessingId(null);
    }
  }

  async function reject(id: string) {
    try {
      setProcessingId(id);
      await BackendApi.rejectOrder(id);
      showToast('Order rejected', 'info');
      await refresh();
    } catch (e: any) {
      console.error(e);
      showToast(`Reject failed: ${e.message ?? 'Unknown error'}`, 'error');
    } finally {
      setProcessingId(null);
    }
  }

  return { orders, loading, error, processingId, approve, reject, refresh };
}
