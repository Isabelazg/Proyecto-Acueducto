import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PeriodPage } from './features/period/PeriodPage';
import { PeoplePage } from './features/people/PeoplePage';
import { BalancePage } from './features/balance/BalancePage';
import { getCurrentPeriod } from './lib/utils';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to={`/periodo/${getCurrentPeriod()}`} replace />} />
            <Route path="periodo/:period" element={<PeriodPage />} />
            <Route path="personas" element={<PeoplePage />} />
            <Route path="balance" element={<BalancePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
