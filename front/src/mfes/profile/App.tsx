'use client';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ProfileViewPage from './components/profile-view-page';

import type { MicroFrontendRuntimeProps } from '../lib/types';

export function App({ basename }: MicroFrontendRuntimeProps) {
  return (
    <BrowserRouter basename={basename ?? '/'}>
      <Routes>
        <Route path='/' element={<ProfileViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
