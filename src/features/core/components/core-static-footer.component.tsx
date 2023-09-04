import { memo, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import cx from 'classix';

import { ABSOLUTE_REGISTER_PATH, DASHBOARD_PATH } from '#/utils/path.util';
import { BaseButton } from '#/base/components/base-button.components';
import { useBoundStore } from '#/core/hooks/use-store.hook';

import studentWithNumbersPng from '#/assets/images/illu-student-with-numbers.png';
import logoColPng from '#/assets/images/logo-col.png';
import gridPng from '#/assets/images/grid.png';

import type { ComponentProps } from 'react';

const bgStyle = { backgroundImage: `url(${gridPng})` };
const currentYear = new Date().getFullYear();

export const CoreStaticFooter = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'footer'>) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setOpenRegister = useBoundStore((state) => state.setOpenRegister);
  const user = useBoundStore((state) => state.user);

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
      navigate(DASHBOARD_PATH);
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
        <div className='mb-40 flex items-center justify-between'>
          <img
            src={studentWithNumbersPng}
            alt='student with numbers'
            width={667}
            height={474}
            className='-translate-x-4'
          />
          <div className='flex flex-col items-center pt-6'>
            <h2 className='mb-7 text-[44px] font-bold'>
              Begin your journey with{' '}
              <i className='text-secondary'>
                {import.meta.env.VITE_META_TITLE}
              </i>{' '}
              today.
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
          <img src={logoColPng} alt='footer logo' width={218} height={132} />
        </Link>
        <span className='text-lg font-medium leading-none'>
          © {currentYear} Math Grellic. All rights reserved
        </span>
      </div>
    </footer>
  );
});
