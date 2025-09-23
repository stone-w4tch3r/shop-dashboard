import type { NavItem } from '@/types/navigation';

import { DEFAULT_EDITION } from '../config';
import { editionConfigurations, microFrontendDefinitions } from '../config';

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
  const navItems: NavItem[] = [];
  const primaryItems: NavItem[] = [];
  const accountItems: NavItem[] = [];

  getEditionMicroFrontends(edition).forEach((definition) => {
    const item: NavItem = {
      title: definition.title,
      url: definition.pathPrefix,
      icon: definition.icon
    };

    if (definition.section === 'account') {
      accountItems.push(item);
    } else {
      primaryItems.push(item);
    }
  });

  navItems.push(...primaryItems);

  if (accountItems.length > 0) {
    accountItems.push({
      title: 'Login',
      url: '/',
      icon: 'login'
    });

    navItems.push({
      title: 'Account',
      url: '#',
      icon: 'billing',
      items: accountItems
    });
  }

  return navItems;
}
export function getNavItems(
  edition: MicroFrontendEdition = DEFAULT_EDITION
): NavItem[] {
  return buildNavItems(edition);
} // Info: The following data is used for the sidebar navigation and Cmd K bar.

export const navItems: NavItem[] = getNavItems();
