import { memo, useCallback } from 'react';
import cx from 'classix';

import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { UserRole } from '../models/user.model';

import selectStudentPng from '#/assets/images/select-student.png';
import selectTeacherPng from '#/assets/images/select-teacher.png';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  loading?: boolean;
  onRoleChange: (role: UserRole) => void;
};

type ButtonProps = ComponentProps<'button'> & {
  label: string;
};

const Button = memo(function ({
  className,
  label,
  children,
  ...moreProps
}: ButtonProps) {
  return (
    <button
      className={cx(
        'group/rbtn w-[240px] transition-transform active:scale-95',
        className,
      )}
      {...moreProps}
    >
      <div className='relative w-full pt-5 transition-transform group-hover/rbtn:-translate-y-5'>
        {children}
        <BaseSurface
          className={cx(
            'flex w-full justify-center border border-primary-focus/50 !pb-3 !pt-[170px] font-display text-21px font-bold leading-none',
            'tracking-tighter text-primary drop-shadow-primary transition-all group-hover/rbtn:text-primary-focus group-hover/rbtn:drop-shadow-primary-focus',
          )}
          rounded='base'
        >
          {label}
        </BaseSurface>
      </div>
    </button>
  );
});

export const AuthRegisterRolePicker = memo(function ({
  className,
  loading,
  onRoleChange,
  ...moreProps
}: Props) {
  const handleRoleChange = useCallback(
    (role: UserRole) => () => onRoleChange(role),
    [onRoleChange],
  );

  return (
    <div className={cx('relative pb-16', className)} {...moreProps}>
      {loading && (
        <div className='absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center'>
          <BaseSpinner />
        </div>
      )}
      <div
        className={cx(
          'flex flex-col items-center transition-opacity',
          loading && 'opacity-50',
        )}
      >
        <div className='mb-12 flex flex-col items-center'>
          <h2 className='mb-2 w-full text-center text-28px leading-tight xs:leading-normal'>
            Which one are you?
          </h2>
          <span className='text-lg'>
            Select your classroom role to get started
          </span>
        </div>
        <div className='flex flex-col items-start justify-center gap-10 lg:flex-row'>
          <Button
            label='Student'
            onClick={handleRoleChange(UserRole.Student)}
            disabled={loading}
          >
            <img
              src={selectStudentPng}
              alt='select student'
              width={221}
              height={181}
              className='absolute left-1/2 top-0 z-10 -translate-x-1/2'
            />
          </Button>
          <Button
            label='Teacher'
            onClick={handleRoleChange(UserRole.Teacher)}
            disabled={loading}
          >
            <img
              src={selectTeacherPng}
              alt='select teacher'
              width={221}
              height={181}
              className='absolute left-1/2 top-0 z-10 -translate-x-1/2'
            />
          </Button>
        </div>
      </div>
    </div>
  );
});
