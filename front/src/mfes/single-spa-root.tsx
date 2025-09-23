'use client';

import { useEffect, useMemo } from 'react';
import { getAppNames, registerApplication, start } from 'single-spa';

import type { MicroFrontendEdition } from '@/mfes/config';
import { getEditionMicroFrontends } from '@/mfes/lib/build-helpers';

let singleSpaStarted = false;

interface SingleSpaRootProps {
  edition?: MicroFrontendEdition;
}

export function SingleSpaRoot({ edition = 'default' }: SingleSpaRootProps) {
  // keep the list of MFEs stable for the chosen edition so we only register
  // apps when the edition actually changes
  const definitions = useMemo(
    () => getEditionMicroFrontends(edition),
    [edition]
  );

  // register MFEs from editions list
  useEffect(() => {
    const registeredApps = new Set(getAppNames());

    definitions.forEach((definition) => {
      if (registeredApps.has(definition.key)) {
        return;
      }

      // defer loading the lifecycle bundle until the route becomes active
      registerApplication({
        name: definition.key,
        app: async () => {
          const lifecycles = await definition.loader();
          return lifecycles;
        },
        activeWhen: (location) =>
          location.pathname.startsWith(definition.pathPrefix),
        customProps: {
          basename: definition.pathPrefix,
          containerId: definition.containerId
        }
      });
    });

    if (!singleSpaStarted) {
      // start single-spa exactly once; urlRerouteOnly avoids double-pushing
      // history entries because Next already manages the outer router
      start({ urlRerouteOnly: true });
      singleSpaStarted = true;
    }
  }, [definitions]);

  return (
    <div className='flex flex-1 flex-col'>
      {/* render a container DIV for each definition so mount() has a target */}
      {definitions.map((definition) => (
        <div
          key={definition.key}
          id={definition.containerId}
          data-mfe-container={definition.key}
          className='flex-1'
        />
      ))}
    </div>
  );
}

export default SingleSpaRoot;
