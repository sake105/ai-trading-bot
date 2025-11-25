
import { BrowserRouter } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { AppRouter } from './router';
import { ToastProvider } from './shared/toast/ToastProvider';

export function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppLayout>
          <AppRouter />
        </AppLayout>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
