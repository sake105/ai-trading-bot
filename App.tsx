
import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { AppRouter } from './router';

function App() {
  const [isLive, setIsLive] = useState(false);
  
  return (
    <BrowserRouter>
      <AppLayout isLive={isLive} toggleLive={() => setIsLive(!isLive)}>
        <AppRouter />
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
