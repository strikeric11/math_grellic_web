import { memo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  label?: string;
};

export const BaseStepperStep = memo(function BaseStepperStep({
  className,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  label,
  ...moreProps
}: Props) {
  return <div className={cx('w-full', className)} {...moreProps} />;
});

BaseStepperStep.displayName = 'BaseStepperStep';
