'use client';

import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import { ProductDetailsScreen } from './screens/ProductDetailsScreen';
import { ProductListScreen } from './screens/ProductListScreen';
import { MicroFrontendErrorBoundary } from '../lib/micro-frontend-error-boundary';
import {
  MicroFrontendNotFound,
  RouterLifecycleManager
} from '../lib/router-lifecycle';

import type { MicroFrontendRuntimeProps } from '../lib/types';

const MFE_KEY = 'product';

function ProductRoutes() {
  const location = useLocation();
  const resetKey = `${location.pathname}${location.search}`;

  return (
    <MicroFrontendErrorBoundary key={resetKey} mfeKey={MFE_KEY}>
      <>
        <RouterLifecycleManager mfeKey={MFE_KEY} />
        <Routes>
          <Route path='/' element={<ProductListScreen />} />
          <Route path='new' element={<ProductDetailsScreen mode='create' />} />
          <Route
            path=':productId'
            element={<ProductDetailsScreen mode='edit' />}
          />
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
      <ProductRoutes />
    </BrowserRouter>
  );
}

export default App;
