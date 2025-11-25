
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { OrdersPage } from './features/orders/OrdersPage';
import { RiskPage } from './features/risk/RiskPage';
import { QaPage } from './features/qa/QaPage';
import { EventsPage } from './features/events/EventsPage';
import { CongressPage } from './features/congress/CongressPage';
import { ShippingPage } from './features/shipping/ShippingPage';
import { features } from './config/features';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/risk" element={<RiskPage />} />
      <Route path="/qa" element={<QaPage />} />
      <Route path="/events" element={<EventsPage />} />
      {features.congress && <Route path="/congress" element={<CongressPage />} />}
      {features.shipping && <Route path="/shipping" element={<ShippingPage />} />}
    </Routes>
  );
}
