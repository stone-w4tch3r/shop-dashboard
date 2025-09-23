'use client';

import PageContainer from '@/components/layout/page-container';

import { createReactMfe } from '../lib/create-react-mfe';

import type { MicroFrontendRuntimeProps } from '../lib/types';

function OverviewPlaceholder() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center'>
        <h1 className='text-2xl font-semibold'>Overview MFE</h1>
        <p className='text-muted-foreground'>
          The overview dashboard micro-frontend will be migrated in a future
          step.
        </p>
      </div>
    </PageContainer>
  );
}

const lifecycles = createReactMfe<MicroFrontendRuntimeProps>({
  name: 'dashboard-overview',
  RootComponent: OverviewPlaceholder
});

export const { bootstrap, mount, unmount, update } = lifecycles;
