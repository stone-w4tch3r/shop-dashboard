import type { NavItem } from '@/types/navigation';

import { editionConfigurations, microFrontendDefinitions } from '../config';
import { PathPrefix } from './types';

import type {
  EditionConfig,
  MicroFrontendDefinition,
  MicroFrontendEdition,
  MicroFrontendKey
} from '../config';

const microFrontendMap = new Map<MicroFrontendKey, MicroFrontendDefinition>(
  microFrontendDefinitions.map((definition) => [definition.key, definition])
);

export function listMicroFrontends(): MicroFrontendDefinition[] {
  return microFrontendDefinitions.slice();
}

export function getMicroFrontend(
  key: MicroFrontendKey
): MicroFrontendDefinition {
  const definition = microFrontendMap.get(key);
  if (!definition) {
    throw new Error(`Unknown micro frontend key: ${key}`);
  }
  return definition;
}

export function listEditionConfigs(): EditionConfig[] {
  return editionConfigurations.slice();
}

export function getEditionConfig(edition: MicroFrontendEdition): EditionConfig {
  const config = editionConfigurations.find((item) => item.key === edition);
  if (!config) {
    throw new Error(`Unknown micro frontend edition: ${edition}`);
  }
  return config;
}

export function getEditionMicroFrontends(
  edition: MicroFrontendEdition
): MicroFrontendDefinition[] {
  const editionConfig = getEditionConfig(edition);
  return editionConfig.mfes.map((key) => getMicroFrontend(key));
}

export function buildNavItems(edition: MicroFrontendEdition): NavItem[] {
  return getEditionMicroFrontends(edition).map((definition) => ({
    title: definition.title,
    url: definition.pathPrefix,
    icon: definition.icon
  }));
}

/**
 * Compile-time checker for path validity
 * */

export function validPathPrefix<T extends `/${string}`>(
  s: T & (T extends `${string}/` ? never : unknown)
): T & PathPrefix {
  if (process.env.NODE_ENV !== 'production') {
    if (!s.startsWith('/')) {
      throw new Error(
        `validPathPrefix expected value to start with '/'. Received: "${s}"`
      );
    }
    if (s.length > 1 && s.endsWith('/')) {
      throw new Error(
        `validPathPrefix expected value without trailing '/'. Received: "${s}"`
      );
    }
  }

  return s as unknown as T & PathPrefix;
}
