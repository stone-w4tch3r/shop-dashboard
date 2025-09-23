'use client';

import SingleSpaRoot from '@/components/mfe/single-spa-root';

export default function DashboardMicroFrontendPage() {
  return (
    <div className='flex flex-1 flex-col overflow-hidden'>
      <SingleSpaRoot />
    </div>
  );
}
