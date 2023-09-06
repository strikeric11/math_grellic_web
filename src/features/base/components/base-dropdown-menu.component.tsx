import { Fragment, memo } from 'react';
import { Menu, Transition } from '@headlessui/react';
import cx from 'classix';

import { menuTransition } from '#/utils/animation.util';
import { BaseIconButton } from './base-icon-button.component';
import { BaseSurface } from './base-surface.component';

import type { ComponentProps, ReactNode } from 'react';

type Props = Omit<ComponentProps<typeof Menu>, 'children'> & {
  children?: ReactNode;
};

export const BaseDropdownMenu = memo(function ({
  className,
  children,
  ...moreProps
}: Props) {
  return (
    <Menu
      as='div'
      className={cx('relative inline-block text-left', className)}
      {...moreProps}
    >
      <div>
        <Menu.Button as={BaseIconButton} name='caret-down' className='button' />
      </div>
      <Transition as={Fragment} {...menuTransition}>
        <Menu.Items
          as={BaseSurface}
          className='absolute right-0 z-50 mt-2.5 w-56 origin-top-right !p-1.5 drop-shadow-primary-sm'
          rounded='xs'
        >
          {children}
        </Menu.Items>
      </Transition>
    </Menu>
  );
});
