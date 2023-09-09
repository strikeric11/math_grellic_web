import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classix';

import { DASHBOARD_PATH } from '#/utils/path.util';
import { BaseButton } from '#/base/components/base-button.components';
import { useBoundStore } from '#/core/hooks/use-store.hook';

import teacherWithLogoPng from '#/assets/images/illu-teacher-with-logo.png';
import homeContent from '../content/home-content.json';

import type { ComponentProps } from 'react';

export const HomeSection1 = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'section'>) {
  const navigate = useNavigate();
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
      setOpenRegister(true);
    } else {
      navigate(DASHBOARD_PATH);
    }
  }, [user, setOpenRegister, navigate]);

  return (
    <section
      className={cx(
        'mx-auto flex w-full max-w-static-full flex-col items-center px-4',
        className,
      )}
      {...moreProps}
    >
      <div className='mb-6 text-center'>
        <h2 className='text-[40px]'>{homeContent.section1.title}</h2>
        <p className='text-lg'>{homeContent.section1.content}</p>
      </div>
      <BaseButton
        className='mb-16'
        variant='primary'
        rightIconName='rocket-launch'
        onClick={handleGetStarted}
        disabled={user === undefined}
      >
        {getStartedText}
      </BaseButton>
      <img
        src={teacherWithLogoPng}
        alt='teacher with logo'
        width={766}
        height={472}
      />
    </section>
  );
});
