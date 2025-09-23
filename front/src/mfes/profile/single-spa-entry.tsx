'use client';

import PageContainer from '@/components/layout/page-container';

import { createReactMfe } from '../lib/create-react-mfe';

import type { MicroFrontendRuntimeProps } from '../lib/types';

function ProfilePlaceholder() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center'>
        <h1 className='text-2xl font-semibold'>Profile MFE</h1>
        <p className='text-muted-foreground'>
          Profile experience will be migrated to the new host soon.
        </p>
      </div>
    </PageContainer>
  );
}

const lifecycles = createReactMfe<MicroFrontendRuntimeProps>({
  name: 'dashboard-profile',
  RootComponent: ProfilePlaceholder
});

export const { bootstrap, mount, unmount, update } = lifecycles;
