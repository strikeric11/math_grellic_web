import { Fragment, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import cx from 'classix';

import {
  dialogBackdropTransition,
  dialogPanelTransition,
} from '#/utils/animation.util';
import { BaseSurface } from './base-surface.component';
import { BaseControlButton } from './base-control-button.component';

import type { ComponentProps, ReactNode } from 'react';
import type { ModalSize } from '../models/base.model';

type Props = Omit<ComponentProps<typeof BaseSurface>, 'children'> & {
  open: boolean;
  onClose?: () => void;
  size?: ModalSize;
  children?: ReactNode;
};

export function BaseModal({
  className,
  open,
  size = 'base',
  children,
  onClose,
  ...moreProps
}: Props) {
  const handleClose = useCallback(() => {
    !!onClose && onClose();
  }, [onClose]);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as='div' onClose={handleClose}>
        <Transition.Child as={Fragment} {...dialogBackdropTransition}>
          <div className='fixed inset-0 z-max bg-black/20 backdrop-blur-none xs:backdrop-blur-lg' />
        </Transition.Child>
        <div className='fixed inset-0 z-max w-screen overflow-y-auto'>
          <Transition.Child as={Fragment} {...dialogPanelTransition}>
            <div className='flex h-full min-h-full items-center justify-center'>
              <Dialog.Panel
                className={cx(
                  'h-full w-full max-w-full transition-all xs:h-auto xs:max-w-[700px]',
                  size === 'xs' && 'xs:!max-w-sm',
                  size === 'sm' && 'xs:!max-w-xl',
                  size === 'lg' && 'xs:!max-w-[968px]',
                  size === 'none' && '!max-w-none',
                )}
              >
                <BaseSurface
                  className={cx(
                    'relative h-full min-h-[150px] w-full overflow-hidden !rounded-none !bg-backdrop px-4 shadow-none xs:h-auto xs:!rounded-20px xs:px-5 xs:shadow-md',
                    onClose ? 'pt-14' : 'pt-8',
                    className,
                  )}
                  rounded='lg'
                  {...moreProps}
                >
                  {!!onClose && (
                    <BaseControlButton
                      className='absolute right-5 top-5 z-10'
                      leftIconName='x'
                      onClick={onClose}
                    >
                      Close
                    </BaseControlButton>
                  )}
                  {children}
                </BaseSurface>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
