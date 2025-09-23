'use client';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { StoryboardRootRoute } from './routes/root';

import type { MicroFrontendRuntimeProps } from '../lib/types';

export function StoryboardApp({ basename }: MicroFrontendRuntimeProps) {
  return (
    <BrowserRouter basename={basename ?? '/'}>
      <Routes>
        <Route path='/' element={<StoryboardRootRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
