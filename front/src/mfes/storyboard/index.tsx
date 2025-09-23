'use client';

import { StoryboardApp } from './app';
import { createReactMfe } from '../lib/create-react-mfe';

import type { MicroFrontendRuntimeProps } from '../lib/types';

const lifecycles = createReactMfe<MicroFrontendRuntimeProps>({
  name: 'dashboard-storyboard',
  RootComponent: StoryboardApp
});

export const { bootstrap, mount, unmount, update } = lifecycles;
