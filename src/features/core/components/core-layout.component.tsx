import { useMemo } from 'react';
import { Outlet, useMatches } from 'react-router-dom';

import { BaseScene } from '#/base/components/base-scene.component';
import { BaseGroupLink } from '#/base/components/base-group-link.component';
import { useClockSocket } from '../hooks/use-clock-socket.hook';
import { CoreSidebar } from './core-sidebar.component';
import { CoreMain } from './core-main.component';
import { CoreHeader } from './core-header.component';

import type { SceneRouteHandle } from '#/base/models/base.model';

export function CoreLayout() {
  useClockSocket();
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

  return (
    <div className='flex items-start justify-start'>
      <CoreSidebar />
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
