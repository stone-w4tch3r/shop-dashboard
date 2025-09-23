'use client';

import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import OverviewPage from './components/overview';
import { MicroFrontendErrorBoundary } from '../lib/micro-frontend-error-boundary';
import {
  MicroFrontendNotFound,
  RouterLifecycleManager
} from '../lib/router-lifecycle';

import type { MicroFrontendRuntimeProps } from '../lib/types';

const MFE_KEY = 'overview';

function OverviewRoutes() {
  const location = useLocation();
  const resetKey = `${location.pathname}${location.search}`;

  return (
    <MicroFrontendErrorBoundary key={resetKey} mfeKey={MFE_KEY}>
      <>
        <RouterLifecycleManager mfeKey={MFE_KEY} />
        <Routes>
          <Route path='/' element={<OverviewPage />} />
          <Route
            path='*'
            element={<MicroFrontendNotFound mfeKey={MFE_KEY} />}
          />
        </Routes>
      </>
    </MicroFrontendErrorBoundary>
  );
}

export function App({ basename }: MicroFrontendRuntimeProps) {
  return (
    <BrowserRouter basename={basename ?? '/'}>
      <OverviewRoutes />
    </BrowserRouter>
  );
}

export default App;
