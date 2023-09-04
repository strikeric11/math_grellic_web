import { Outlet } from 'react-router-dom';

import { CoreStaticHeader } from './core-static-header.component';
import { CoreStaticFooter } from './core-static-footer.component';
import { CoreStaticMain } from './core-static-main.component';

export function CoreStaticLayout() {
  return (
    <>
      <CoreStaticHeader />
      <CoreStaticMain id='main'>
        <Outlet />
      </CoreStaticMain>
      <CoreStaticFooter />
      {/* TODO <AuthRegisterModal />
      <AuthLoginModal /> */}
    </>
  );
}
