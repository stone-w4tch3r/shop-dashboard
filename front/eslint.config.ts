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

  // Type-aware TypeScript configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      // Include ALL typescript-eslint type-checking rules
      ...tseslint.configs.recommendedTypeChecked[1]?.rules,
      ...tseslint.configs.strictTypeChecked[1]?.rules
    }
  },

  // TypeScript rules - Enforce CLAUDE.md standards
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-unused-vars': 'off', // Turn off base rule in favor of TypeScript version
      '@typescript-eslint/no-unused-vars': [
        process.env.NODE_ENV === 'development' ? 'warn' : 'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      'no-console': process.env.NODE_ENV === 'development' ? 'warn' : 'error',

      // TypeScript Best Practices - Strict Type Policy
      '@typescript-eslint/no-explicit-any': 'error', // Forbid any
      '@typescript-eslint/no-unsafe-assignment': 'error', // Forbid any assignments
      '@typescript-eslint/no-unsafe-member-access': 'error', // Forbid any.property
      '@typescript-eslint/no-unsafe-call': 'error', // Forbid any()
      '@typescript-eslint/no-unsafe-return': 'error', // Forbid returning any
      '@typescript-eslint/no-unsafe-argument': 'error', // Forbid any as argument

      // Additional type safety
      'prefer-const': 'error',

      // Tier 1: Core Comparison & Casting Safety (High Impact)
      eqeqeq: 'error', // Force === instead of ==
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: true, // Allow obj && obj.method()
          allowNullableBoolean: true,
          allowNullableString: false,
          allowNullableNumber: false,
          allowAny: false
        }
      ],
      '@typescript-eslint/no-non-null-assertion': 'error', // Forbid dangerous ! operator
      '@typescript-eslint/prefer-nullish-coalescing': 'error', // Use ?? instead of ||

      // Tier 2: High Value Safety & Readability Rules
      '@typescript-eslint/prefer-optional-chain': 'error', // Use ?. instead of && chains
      '@typescript-eslint/no-unnecessary-type-assertion': 'error', // Remove redundant assertions
      '@typescript-eslint/switch-exhaustiveness-check': 'error', // Ensure switch completeness
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'as',
          objectLiteralTypeAssertions: 'never'
        }
      ],
      '@typescript-eslint/prefer-as-const': 'error', // Use as const for literals

      // Forbid vague types in favor of explicit types
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-empty-object-type': 'error', // Forbid {} - use Record<string, unknown> instead
      '@typescript-eslint/prefer-function-type': 'error', // Prefer function types over interfaces with call signatures
      '@typescript-eslint/no-wrapper-object-types': 'error', // Forbid Object, Boolean, Number, String, Symbol
      '@typescript-eslint/no-unsafe-function-type': 'error', // Forbid Function - use specific signatures instead
      // Ban the 'object' type using the no-restricted-types rule
      '@typescript-eslint/no-restricted-types': [
        'error',
        {
          types: {
            object: {
              message:
                'Use Record<string, unknown> or a specific interface instead of object',
              fixWith: 'Record<string, unknown>',
              suggest: [
                'Record<string, unknown>',
                'Record<string, any>',
                'Record<PropertyKey, unknown>'
              ]
            }
          }
        }
      ],

      // Explicit return types - enforced for non-obvious cases only
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true, // Allow arrow functions as expressions (type inferred)
          allowTypedFunctionExpressions: true, // Allow when function type already specified
          allowHigherOrderFunctions: true, // Allow functions returning functions
          allowDirectConstAssertionInArrowFunctions: true, // Allow `() => value as const`
          allowConciseArrowFunctionExpressionsStartingWithVoid: true, // Allow `() => void expression`
          allowFunctionsWithoutTypeParameters: true, // Allow simple functions with obvious returns
          allowedNames: [], // No function name exceptions
          allowIIFEs: true // Allow immediately invoked function expressions
        }
      ]

      // CLAUDE.md Goal: Maximum TypeScript safety (catch as many errors as possible)
    }
  },

  // React/JSX specific rules
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      // React hooks rules (these come from next/core-web-vitals)
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',

      // React components - relaxed return type enforcement (can be noisy)
      '@typescript-eslint/explicit-function-return-type': [
        'error', // Still enforce, but with very permissive settings
        {
          allowExpressions: true, // Allow arrow function expressions
          allowTypedFunctionExpressions: true, // Allow when type already specified
          allowHigherOrderFunctions: true, // Allow functions returning functions
          allowDirectConstAssertionInArrowFunctions: true, // Allow `() => value as const`
          allowConciseArrowFunctionExpressionsStartingWithVoid: true, // Allow `() => void expression`
          allowFunctionsWithoutTypeParameters: true, // Very permissive for React components
          allowedNames: [], // No function name exceptions
          allowIIFEs: true // Allow immediately invoked function expressions
        }
      ]
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
  },

  // Relaxed rules for shadcn/ui and template-provided components
  {
    files: [
      'src/components/ui/**/*', // shadcn/ui components
      'src/components/kbar/**/*' // kbar library components
    ],
    rules: {
      // Original exemptions
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',

      // New comparison/casting safety rule exemptions
      eqeqeq: 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/prefer-as-const': 'off',

      // Vague type rule exemptions
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/prefer-function-type': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-restricted-types': 'off'
    }
  }
];

export default config;
