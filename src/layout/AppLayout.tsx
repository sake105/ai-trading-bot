
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ConnectionStatus } from '../shared/components/ConnectionStatus';

interface Props {
  children: ReactNode;
  isLive: boolean;
  toggleLive: () => void;
}

export function AppLayout({ children, isLive, toggleLive }: Props) {
  return (
    <div className="app-root">
      <Sidebar />
      <div className="app-main">
        <Topbar isLive={isLive} toggleLive={toggleLive} />
        <ConnectionStatus />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
