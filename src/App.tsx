
import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { AppRouter } from './router';
import { ToastProvider } from './shared/toast/ToastProvider';

export function App() {
  const [isLive, setIsLive] = useState(false);

  return (
    <ToastProvider>
      <BrowserRouter>
        <AppLayout isLive={isLive} toggleLive={() => setIsLive(!isLive)}>
          <AppRouter />
        </AppLayout>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
