import { useEffect, useMemo } from 'react';
import { Outlet, useMatches } from 'react-router-dom';
import { io } from 'socket.io-client';

import { createSocket } from '#/config/socket.config';
import { BaseScene } from '#/base/components/base-scene.component';
import { BaseGroupLink } from '#/base/components/base-group-link.component';
import { useBoundStore } from '../hooks/use-store.hook';
import { CoreSidebar } from './core-sidebar.component';
import { CoreMain } from './core-main.component';
import { CoreHeader } from './core-header.component';

import type { SceneRouteHandle } from '#/base/models/base.model';

export function CoreLayout() {
  const setSocket = useBoundStore((state) => state.setSocket);
  const matches = useMatches();

  // Get current route handle
  const currentHandle = useMemo(
    () => matches[matches.length - 1].handle as SceneRouteHandle,
    [matches],
  );

  // Extract handle and create object for BaseScene props
  const sceneProps = useMemo(() => {
    const headerRightContent = currentHandle?.links ? (
      <BaseGroupLink links={currentHandle?.links} />
    ) : undefined;

    return {
      title: currentHandle?.title,
      toolbarHidden: currentHandle?.toolbarHidden,
      breadcrumbsHidden: currentHandle?.breadcrumbsHidden,
      isClose: currentHandle?.isClose,
      headerRightContent,
    };
  }, [currentHandle]);

  const disabledSceneWrapper = useMemo(
    () => currentHandle?.disabledSceneWrapper || false,
    [currentHandle],
  );

  useEffect(() => {
    // Create socket connection and set zustand socket
    const [url, options] = createSocket();
    const socket = io(url, options);
    setSocket(socket);

    return () => {
      // Close connection on unmount of core layout
      if (socket.connected) {
        socket.close();
      }
    };
  }, [setSocket]);

  return (
    <div className='flex flex-col items-start justify-start lg:flex-row'>
      <CoreSidebar className='hidden lg:block' />
      <CoreMain id='main'>
        <CoreHeader />
        {disabledSceneWrapper ? (
          <div className='relative z-10 flex flex-1 flex-col'>
            <Outlet />
          </div>
        ) : (
          <BaseScene {...sceneProps}>
            <Outlet />
          </BaseScene>
        )}
      </CoreMain>
    </div>
  );
}
