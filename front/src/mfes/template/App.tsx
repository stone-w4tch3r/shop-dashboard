'use client';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Content from './Content';

import type { MicroFrontendRuntimeProps } from '../lib/types';

export function App({ basename }: MicroFrontendRuntimeProps) {
  return (
    <BrowserRouter basename={basename ?? '/'}>
      <Routes>
        <Route path='/' element={<Content />} />
      </Routes>
    </BrowserRouter>
  );
}
