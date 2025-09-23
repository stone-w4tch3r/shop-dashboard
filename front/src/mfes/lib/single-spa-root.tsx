'use client';

import { useEffect, useMemo } from 'react';
import {
  addErrorHandler,
  getAppNames,
  registerApplication,
  removeErrorHandler,
  start
} from 'single-spa';

import type { MicroFrontendEdition } from '@/mfes/config';
import { useEdition } from '@/mfes/lib/edition-context';
import { getEditionMicroFrontends } from '@/mfes/lib/mfe-helpers';
import {
  clearMfeRuntimeError,
  reportMfeRuntimeError
} from '@/mfes/lib/mfe-runtime-error-store';

let singleSpaStarted = false;
let errorHandlerRegistered = false;

interface SingleSpaRootProps {
  edition?: MicroFrontendEdition;
}

type SingleSpaErrorHandler = (error: unknown) => void;

export function SingleSpaRoot({ edition }: SingleSpaRootProps) {
  const { edition: contextEdition } = useEdition();
  const activeEdition = edition ?? contextEdition;
  // keep the list of MFEs stable for the chosen edition so we only register
  // apps when the edition actually changes
  const definitions = useMemo(
    () => getEditionMicroFrontends(activeEdition),
    [activeEdition]
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
        app: async () => definition.loader(),
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

  // register error handler
  useEffect(() => {
    if (errorHandlerRegistered) {
      return;
    }

    const handler: SingleSpaErrorHandler = (error) => {
      const maybeError = error as {
        appOrParcelName?: unknown;
        originalError?: unknown;
      };
      const appName = maybeError.appOrParcelName;
      const originalError = maybeError.originalError;

      if (typeof appName === 'string' && originalError instanceof Error) {
        reportMfeRuntimeError(appName, originalError);
      }
    };

    addErrorHandler(handler);
    errorHandlerRegistered = true;

    return () => {
      removeErrorHandler(handler);
      errorHandlerRegistered = false;
    };
  }, []);

  useEffect(() => {
    clearMfeRuntimeError();
  }, [activeEdition]);

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
