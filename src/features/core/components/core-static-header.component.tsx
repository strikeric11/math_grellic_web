import { memo, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import toast from 'react-hot-toast';
import cx from 'classix';

import { generateDashboardPath } from '#/utils/path.util';
import { staticRouteLinks, staticRoutes } from '#/app/routes/static-routes';
import { useAuth } from '#/user/hooks/use-auth.hook';
import { useBoundStore } from '../hooks/use-store.hook';
import { CoreStaticLogo } from './core-static-logo.component';
import { CoreStaticNav } from './core-static-nav.component';

import type { ComponentProps } from 'react';
import type { HTTPError } from 'ky';

const SCROLL_Y_THRESHOLD = 40;
const ABSOLUTE_REGISTER_PATH = `/${staticRoutes.authRegister.to}`;

export const CoreStaticHeader = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'header'>) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { scrollY } = useScroll();
  const { logout } = useAuth();
  const [isScrollTop, setIsScrollTop] = useState(true);
  const [loading, setLoading] = useState(false);

  const setOpenRegister = useBoundStore((state) => state.setOpenRegister);
  const setOpenLogin = useBoundStore((state) => state.setOpenLogin);
  const user = useBoundStore((state) => state.user);

  const isHome = pathname === '/';

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrollTop(latest <= SCROLL_Y_THRESHOLD);
  });

  const handleGetStarted = useCallback(async () => {
    // If no user is signed-in show sign-up wizard,
    // else sign-out current user
    if (!user) {
      // If already on register page, just scroll to top
      if (pathname === ABSOLUTE_REGISTER_PATH) {
        const element = document.getElementById('main');
        !!element && element.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      setOpenRegister(true);
    } else {
      try {
        setLoading(true);
        await logout();
      } catch (error) {
        toast.error((error as HTTPError).message);
      } finally {
        setLoading(false);
      }
    }
  }, [pathname, user, logout, setOpenRegister]);

  const handleLogin = useCallback(() => {
    // If no user is signed-in show sign-in modal,
    // else go to dashboard page
    if (!user) {
      setOpenLogin(true);
    } else {
      const to = generateDashboardPath(user.role);
      navigate(to);
    }
  }, [user, setOpenLogin, navigate]);

  return (
    <header
      className={cx('fixed left-0 top-0 z-40 w-screen', className)}
      {...moreProps}
    >
      <div
        className={cx(
          'absolute left-0 top-0 h-full w-full border-b border-primary-border/40 bg-backdrop/60 opacity-0 backdrop-blur transition-opacity',
          !isScrollTop && 'opacity-100',
        )}
      />
      <div
        className={cx(
          'relative z-10 mx-auto flex h-14 w-full max-w-static-full items-center justify-between px-4 transition-[height] lg:h-20',
          !isScrollTop && '!h-14',
        )}
      >
        <CoreStaticLogo to='/' isHome={isHome} isCompact={!isScrollTop} />
        <CoreStaticNav
          items={staticRouteLinks}
          loading={loading}
          onGetStarted={handleGetStarted}
          onLogin={handleLogin}
        />
      </div>
    </header>
  );
});
