'use client';
import { AuthProvider } from '@/lib/mock-auth';
import { useTheme } from 'next-themes';
import React from 'react';
import { ActiveThemeProvider } from '../active-theme';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  // Theme is handled by ThemeProvider and ActiveThemeProvider
  useTheme(); // Keep for theme system compatibility

  return (
    <>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <AuthProvider appearance={{}}>{children}</AuthProvider>
      </ActiveThemeProvider>
    </>
  );
}
