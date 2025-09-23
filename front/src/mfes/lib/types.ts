import type { Icons } from '@/components/icons';

import type { LifeCycles } from 'single-spa';

export interface MicroFrontendDefinitionInput {
  key: string;
  /** Path prefix for the micro frontend, should not end with a slash */
  pathPrefix: string;
  title: string;
  icon: keyof typeof Icons;
  containerId: string;
  loader: () => Promise<LifeCycles>;
}

export interface EditionConfigInput {
  key: string;
  label: string;
  description?: string;
  mfes: string[];
}
export interface MicroFrontendRuntimeProps {
  basename?: string;
  containerId?: string;
}
