
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ConnectionStatus } from '../shared/components/ConnectionStatus';

interface Props {
  children: ReactNode;
}

export function AppLayout({ children }: Props) {
  return (
    <div className="app-root">
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <ConnectionStatus />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
