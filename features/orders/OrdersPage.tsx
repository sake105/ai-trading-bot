
import React, { useEffect, useState } from 'react';
import { BackendApi } from '../../api/backendApi';
import { OrderPreview } from '../../types/domain';
import { OrdersTable } from './components/OrdersTable';
import { ShieldCheck, Loader2 } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderPreview[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const data = await BackendApi.getOrderPreviews();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleApprove = async (id: string) => {
    await BackendApi.approveOrder(id);
    refresh();
  };

  const handleReject = async (id: string) => {
    await BackendApi.rejectOrder(id);
    refresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                SAFE-Bridge Orders
            </h1>
            <p className="text-slate-400 text-sm mt-1">Human-in-the-Loop approval for algo generated orders.</p>
        </div>
        <button onClick={refresh} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
        </button>
      </div>

      <OrdersTable orders={orders} onApprove={handleApprove} onReject={handleReject} />
    </div>
  );
};
