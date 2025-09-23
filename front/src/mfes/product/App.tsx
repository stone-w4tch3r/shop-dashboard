'use client';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ProductDetailsScreen } from './screens/ProductDetailsScreen';
import { ProductListScreen } from './screens/ProductListScreen';

import type { MicroFrontendRuntimeProps } from '../lib/types';

export function App({ basename }: MicroFrontendRuntimeProps) {
  return (
    <BrowserRouter basename={basename ?? '/'}>
      <Routes>
        <Route path='/' element={<ProductListScreen />} />
        <Route path='new' element={<ProductDetailsScreen mode='create' />} />
        <Route
          path=':productId'
          element={<ProductDetailsScreen mode='edit' />}
        />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
