import { Outlet, ScrollRestoration } from 'react-router-dom';

import { AuthRegisterModal } from '#/user/components/auth-register-modal.component';
import { AuthLoginModal } from '#/user/components/auth-login-modal.component';

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
      <AuthRegisterModal />
      <AuthLoginModal />
      <ScrollRestoration />
    </>
  );
}
