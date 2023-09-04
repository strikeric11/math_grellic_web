import { memo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import logoPng from '#/assets/images/logo.png';

import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof Link> & {
  isHome?: boolean;
  isCompact?: boolean;
};

export const CoreStaticLogo = memo(function ({
  className,
  isHome,
  isCompact,
  ...moreProps
}: Props) {
  return (
    <Link
      className={cx(
        'inline-block origin-left py-2 transition-all hover:brightness-110',
        isCompact && 'scale-90',
        className,
      )}
      {...moreProps}
    >
      <img src={logoPng} alt='logo' width={230} height={40} />
      {isHome && (
        <h1 className='invisible absolute'>
          {import.meta.env.NEXT_PUBLIC_META_TITLE}
        </h1>
      )}
    </Link>
  );
});
