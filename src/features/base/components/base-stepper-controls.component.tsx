import { memo } from 'react';
import cx from 'classix';

import { BaseButton } from './base-button.components';
import { BaseDivider } from './base-divider.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  disabled?: boolean;
  isSingleStep?: boolean;
  onReset?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

export const BaseStepperControls = memo(function ({
  className,
  disabled,
  isSingleStep,
  children,
  onReset,
  onPrev,
  onNext,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx('flex items-center justify-between', className)}
      {...moreProps}
    >
      <div className='flex items-center gap-5'>
        <BaseButton
          variant='link'
          size='sm'
          rightIconName='arrow-counter-clockwise'
          onClick={onReset}
          disabled={disabled}
        >
          Reset Fields
        </BaseButton>
        {!isSingleStep && (
          <>
            <BaseDivider className='!h-[46px]' vertical />
            <BaseButton
              variant='link'
              size='sm'
              leftIconName='arrow-circle-left'
              onClick={onPrev}
              disabled={disabled}
            >
              Prev
            </BaseButton>
            <BaseButton
              variant='link'
              size='sm'
              rightIconName='arrow-circle-right'
              onClick={onNext}
              disabled={disabled}
            >
              Next
            </BaseButton>
          </>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
});
