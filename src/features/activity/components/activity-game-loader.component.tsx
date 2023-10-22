import { memo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';
import type { Activity } from '../models/activity.model';

type Props = ComponentProps<'div'> & {
  activity: Activity;
};

export const ActivityGameLoader = memo(function ({
  className,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx(
        'w-full max-w-static-full overflow-hidden rounded-lg',
        className,
      )}
      {...moreProps}
    >
      <iframe
        className='aspect-video w-full'
        src='/game-car-racing/index.html'
      />
    </div>
  );
});
