import type {
  EditionConfigInput,
  MicroFrontendDefinitionInput
} from './lib/types';

export const DEFAULT_EDITION: MicroFrontendEdition = 'default';

export const microFrontendDefinitions: readonly MicroFrontendDefinitionInput[] =
  [
    {
      key: 'overview',
      title: 'Dashboard',
      icon: 'dashboard',
      pathPrefix: '/dashboard/overview',
      containerId: 'mfe-dashboard-overview-container',
      loader: () => import('./overview')
    },
    {
      key: 'storyboard',
      title: 'Storyboard',
      icon: 'media',
      pathPrefix: '/dashboard/storyboard',
      containerId: 'mfe-dashboard-storyboard-container',
      loader: () => import('./storyboard')
    },
    {
      key: 'product',
      title: 'Product',
      icon: 'product',
      pathPrefix: '/dashboard/product',
      containerId: 'mfe-dashboard-product-container',
      loader: () => import('./product')
    },
    {
      key: 'profile',
      title: 'Profile',
      icon: 'userPen',
      pathPrefix: '/dashboard/profile',
      containerId: 'mfe-dashboard-profile-container',
      loader: () => import('./profile')
    }
  ];

export const editionConfigurations: readonly EditionConfigInput[] = [
  {
    key: 'default',
    label: 'Default',
    description: 'Full dashboard experience',
    mfes: ['overview', 'storyboard', 'product', 'profile']
  },
  {
    key: 'v1',
    label: 'Edition V1',
    description: 'Targeting operations-focused users',
    mfes: ['overview', 'product']
  },
  {
    key: 'v2',
    label: 'Edition V2',
    description: 'Minimal set for support teams',
    mfes: ['overview', 'storyboard', 'profile']
  }
];

export type MicroFrontendDefinition = (typeof microFrontendDefinitions)[number];
export type MicroFrontendKey = MicroFrontendDefinition['key'];

export type EditionConfig = (typeof editionConfigurations)[number];
export type MicroFrontendEdition = EditionConfig['key'];
