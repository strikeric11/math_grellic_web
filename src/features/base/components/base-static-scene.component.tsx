import { memo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  title?: string;
};

export const BaseStaticScene = memo(function ({
  className,
  title,
  children,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx(
        'relative z-10 animate-pageChange pb-36 pt-14 lg:pt-20',
        className,
      )}
      {...moreProps}
    >
      {!!title?.trim().length && (
        <h1 className='-2xl:mb-32 mb-16 pt-2 text-center'>{title}</h1>
      )}
      {children}
    </div>
  );
});
