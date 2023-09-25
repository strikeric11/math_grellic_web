import { memo, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import cx from 'classix';

import { teacherBaseRoute, teacherPath } from '#/app/routes/teacher-routes';
import { studentBaseRoute, studentPath } from '#/app/routes/student-routes';
import { UserRole } from '#/user/models/user.model';
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
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [userRole, basePath] = useMemo(() => {
    const path = pathname.split('/')[1];

    // TODO admin
    return (
      {
        [teacherPath]: [UserRole.Teacher, teacherPath],
        [studentPath]: [UserRole.Student, studentPath],
      }[path] || []
    );
  }, [pathname]);

  const handleBack = useCallback(() => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      if (!userRole) {
        return;
      }

      // TODO admin route
      const to =
        {
          [UserRole.Admin]: teacherBaseRoute,
          [UserRole.Teacher]: teacherBaseRoute,
          [UserRole.Student]: studentBaseRoute,
        }[userRole] || '';

      navigate(`/${to}`, { replace: true });
    }
  }, [userRole, navigate]);

  const handleClose = useCallback(() => {
    window.close();
  }, []);

  return (
    <div
      className={cx(
        'relative z-10 flex w-full flex-1 flex-col px-9',
        className,
      )}
      {...moreProps}
    >
      {!!title?.trim() && (
        <div id='scene-title' className='flex h-20 items-center justify-start'>
          <h1 className='w-fit text-2xl'>{title}</h1>
        </div>
      )}
      {!toolbarHidden && (
        <div
          id='scene-toolbar'
          className={cx(
            'flex min-h-[46px] w-full items-center justify-between',
            !title?.trim() && 'h-20',
          )}
        >
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
              <BaseBreadcrumbs pathname={pathname} basePath={basePath} />
            )}
          </div>
          {!!headerRightContent && <div>{headerRightContent}</div>}
        </div>
      )}
      {children}
    </div>
  );
});
