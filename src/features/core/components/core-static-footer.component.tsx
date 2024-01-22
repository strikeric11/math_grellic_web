import { memo, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import cx from 'classix';

import { generateDashboardPath } from '#/utils/path.util';
import { staticRoutes } from '#/app/routes/static-routes';
import { BaseButton } from '#/base/components/base-button.components';
import { useBoundStore } from '../hooks/use-store.hook';

import studentWithNumbersPng from '#/assets/images/illu-student-with-numbers.png';
import logoColPng from '#/assets/images/logo-col.png';
import gridPng from '#/assets/images/grid.png';

import type { ComponentProps } from 'react';

const META_TITLE = import.meta.env.VITE_META_TITLE;
const ABSOLUTE_REGISTER_PATH = `/${staticRoutes.authRegister.to}`;
const bgStyle = { backgroundImage: `url(${gridPng})` };
const currentYear = new Date().getFullYear();

export const CoreStaticFooter = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'footer'>) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useBoundStore((state) => state.user);
  const setOpenRegister = useBoundStore((state) => state.setOpenRegister);

  const getStartedText = useMemo(
    () => (!user ? 'Get Started' : 'Dashboard'),
    [user],
  );

  const handleGetStarted = useCallback(() => {
    // If no user is signed-in show sign-up wizard,
    // else go to dashboard page
    if (!user) {
      // If already on register page, just scroll to top
      if (pathname === ABSOLUTE_REGISTER_PATH) {
        const element = document.getElementById('main');
        !!element && element.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      setOpenRegister(true);
    } else {
      const to = generateDashboardPath(user.role);
      navigate(to);
    }
  }, [pathname, user, setOpenRegister, navigate]);

  return (
    <footer className={cx('relative w-full pb-5', className)} {...moreProps}>
      <div
        style={bgStyle}
        className='absolute bottom-0 h-full w-full bg-backdrop-focus'
      >
        <div className='h-full w-full bg-gradient-to-t from-transparent to-backdrop' />
      </div>
      <div className='relative z-10 mx-auto flex max-w-static-full flex-col items-center'>
        <div className='mb-40 flex flex-col items-center justify-between lg:flex-row'>
          <img
            src={studentWithNumbersPng}
            alt='student with numbers'
            width={667}
            height={474}
            className='xs:max-w-lg max-w-full sm:max-w-xl lg:-translate-x-4 xl:max-w-none'
          />
          <div className='flex flex-col items-center pt-6'>
            <h2 className='mb-7 max-w-md text-center font-bold md:max-w-none lg:text-left xl:text-[44px]'>
              Begin your journey with{' '}
              <i className='text-secondary'>{META_TITLE}</i> today.
            </h2>
            <BaseButton
              variant='primary'
              rightIconName='rocket-launch'
              onClick={handleGetStarted}
              disabled={user === undefined}
            >
              {getStartedText}
            </BaseButton>
          </div>
        </div>
        <Link
          to='/'
          className='mb-10 inline-block transition-all hover:brightness-110'
        >
          <img
            src={logoColPng}
            alt='footer logo'
            width={218}
            height={132}
            className='xs:max-w-none max-w-[160px]'
          />
        </Link>
        <span className='text-lg font-medium leading-none'>
          © {currentYear} Math Grellic. All rights reserved
        </span>
      </div>
    </footer>
  );
});
