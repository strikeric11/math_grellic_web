import { memo, useCallback, useMemo } from 'react';
import { Tab } from '@headlessui/react';
import cx from 'classix';

import { capitalize } from '#/utils/string.util';
import { UserRole } from '../models/user.model';

import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<'div'>, 'onChange'> & {
  userRole: UserRole;
  isDone?: boolean;
  onChange?: (role: UserRole) => void;
  onLogin?: () => void;
};

const tabs = [
  { key: `tab-${UserRole.Student}`, label: capitalize(UserRole.Student) },
  { key: `tab-${UserRole.Teacher}`, label: capitalize(UserRole.Teacher) },
];

export const AuthRegisterRoleTab = memo(function ({
  className,
  userRole,
  isDone,
  onChange,
  onLogin,
  ...moreProps
}: Props) {
  const selectedIndex = useMemo(
    () => (userRole === UserRole.Student ? 0 : 1),
    [userRole],
  );

  const handleChange = useCallback(
    (index: number) => {
      !!onChange && onChange(index === 0 ? UserRole.Student : UserRole.Teacher);
    },
    [onChange],
  );

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <Tab.Group selectedIndex={selectedIndex} onChange={handleChange}>
        <Tab.List className='flex w-full items-center border-b-2 border-accent/10 bg-backdrop-gray/60 p-1.5'>
          {tabs.map(({ key, label }) => (
            <Tab
              key={key}
              className={({ selected }) =>
                cx(
                  `w-full flex-1 rounded bg-transparent py-3 font-display text-lg leading-none tracking-tighter text-accent/70
                    ring-1 ring-transparent transition-all hover:text-primary-focus focus:outline-0 focus:ring-primary`,
                  selected && '!bg-backdrop !text-primary',
                )
              }
              disabled={isDone}
            >
              {label}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className='w-full px-4 pt-8 lg:px-11'>
          <h1 className='xs:leading-normal mb-2 w-full text-center leading-tight sm:text-left'>
            Sign up as a {userRole}
          </h1>
          <p className='max-w-[600px] text-lg'>
            Complete the form and unlock the vast features of Math Grellic. If
            you&apos;re already a member, simply{' '}
            <button
              className='hover:text-primary-focus-ligh text-left text-primary'
              onClick={onLogin}
              disabled={isDone}
            >
              sign in using your existing credentials
            </button>
            .
          </p>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
});
