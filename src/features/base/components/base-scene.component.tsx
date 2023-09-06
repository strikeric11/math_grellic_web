import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classix';

import { DASHBOARD_PATH } from '#/utils/path.util';
import { BaseControlButton } from './base-control-button.component';
import { BaseBreadcrumbs } from './base-breadcrumbs.component';

import type { ComponentProps, ReactNode } from 'react';

type Props = ComponentProps<'div'> & {
  title?: string;
  toolbarHidden?: boolean;
  breadcrumbsHidden?: boolean;
  headerRightContent?: ReactNode;
  isClose?: boolean;
};

export const BaseScene = memo(function ({
  className,
  title,
  toolbarHidden,
  breadcrumbsHidden,
  headerRightContent,
  isClose,
  children,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(DASHBOARD_PATH, { replace: true });
    }
  }, [navigate]);

  const handleClose = useCallback(() => {
    window.close();
  }, []);

  return (
    <div className={cx('relative z-10 px-9', className)} {...moreProps}>
      {!!title?.trim().length && (
        <div className='flex h-20 items-center justify-start'>
          <h1 className='w-fit text-2xl'>{title}</h1>
        </div>
      )}
      {!toolbarHidden && (
        <div className='flex min-h-[46px] w-full items-center justify-between'>
          <div className='flex items-center justify-start gap-2'>
            {isClose ? (
              <BaseControlButton leftIconName='x' onClick={handleClose}>
                Close
              </BaseControlButton>
            ) : (
              <BaseControlButton leftIconName='arrow-left' onClick={handleBack}>
                Back
              </BaseControlButton>
            )}
            {!breadcrumbsHidden && (
              <BaseBreadcrumbs />
              // TODO breadcrumbs
              // <Breadcrumbs
              //   listClassName='flex items-center text-accent/80 text-sm'
              //   inactiveItemClassName='flex hover:text-primary after:content-["/"] after:mx-1.5'
              //   activeItemClassName='!pointer-events-none'
              //   omitRootLabel
              // />
            )}
          </div>
          {!!headerRightContent && <div>{headerRightContent}</div>}
        </div>
      )}
      {children}
    </div>
  );
});
