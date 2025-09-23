import { notFound, redirect } from 'next/navigation';

import { DEFAULT_EDITION, microFrontendDefinitions } from '@/mfes/config';

import WithMfeHostBoundary from '../../../mfes/lib/mfe-host-boundary';
import SingleSpaRoot from '../../../mfes/lib/single-spa-root';

type PageParams = Promise<{ slug?: string[] }>;

type DashboardPageProps = {
  params: PageParams;
};

export default async function DashboardMicroFrontendPage({
  params
}: DashboardPageProps) {
  const resolvedParams = await params;
  const slugValue = resolvedParams.slug;
  const slug = Array.isArray(slugValue) ? slugValue : [];

  if (slug.length === 0) {
    redirect('/dashboard/overview');
  }

  const fullPath = `/dashboard/${slug.join('/')}`;

  if (!isKnownMfe(fullPath)) {
    notFound();
  }

  return (
    <div className='flex flex-1 flex-col overflow-hidden'>
      <WithMfeHostBoundary>
        <SingleSpaRoot edition={DEFAULT_EDITION} />
      </WithMfeHostBoundary>
    </div>
  );
}

function isKnownMfe(fullPath: string) {
  return microFrontendDefinitions.some((definition) => {
    const trimmedPrefix = definition.pathPrefix.endsWith('/')
      ? definition.pathPrefix.slice(0, -1)
      : definition.pathPrefix;

    if (fullPath === trimmedPrefix) {
      return true;
    }

    return fullPath.startsWith(`${trimmedPrefix}/`);
  });
}
