import { memo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & { vertical?: boolean };

export const BaseDivider = memo(function ({
  className,
  vertical,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx(
        'border-accent/20',
        vertical ? 'h-full w-px border-r' : 'h-px w-full border-b',
        className,
      )}
      {...moreProps}
    />
  );
});
