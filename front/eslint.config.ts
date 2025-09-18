import type { Linter } from 'eslint';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);

const compat: FlatCompat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

const config: Linter.Config[] = [
  // Global ignores
  {
    ignores: [
      '**/.next/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/.pnpm-store/**',
      '**/build/**',
      '**/__tests__/**',
      '**/test/**'
    ]
  },

  // Base JavaScript configuration
  js.configs.recommended,

  // Next.js configuration using FlatCompat for legacy config
  ...compat.extends('next/core-web-vitals'),

  // TypeScript configuration using modern typescript-eslint
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx']
  })),

  // Additional TypeScript rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-unused-vars': 'off', // Turn off base rule in favor of TypeScript version
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'error'
    }
  },

  // React/JSX specific rules
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      // React hooks rules (these come from next/core-web-vitals)
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error'
    }
  },

  // Relaxed rules for config files
  {
    files: [
      'vitest.config.ts',
      'playwright.config.ts',
      'next.config.ts',
      'tailwind.config.ts',
      'eslint.config.ts',
      'postcss.config.js'
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off'
    }
  }
];

export default config;
