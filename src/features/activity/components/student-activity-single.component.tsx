import { memo, useCallback, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import cx from 'classix';

import { BaseButton } from '#/base/components/base-button.components';
import { BaseDivider } from '#/base/components/base-divider.component';
import { ActivityGameLoader } from './activity-game-loader.component';

import type { ComponentProps } from 'react';
import type { Activity } from '../models/activity.model';

type Props = ComponentProps<'div'> & {
  activity: Activity;
  preview?: boolean;
};

export const StudentActivitySingle = memo(function ({
  className,
  activity,
  preview,
}: Props) {
  const [startActivity, setStartActivity] = useState(false);

  const descriptionHtml = useMemo(() => {
    const isEmpty = !DOMPurify.sanitize(activity.description || '', {
      ALLOWED_TAGS: [],
    }).trim();

    return !isEmpty
      ? {
          __html: DOMPurify.sanitize(activity.description || ''),
        }
      : null;
  }, [activity]);

  const handleStartActivity = useCallback(() => setStartActivity(true), []);

  return (
    <div className={cx('w-full', className)}>
      {!startActivity ? (
        <div className='flex w-full flex-col items-center gap-y-8 p-4'>
          {descriptionHtml && (
            <div>
              <BaseDivider />
              <div
                className='base-rich-text rt-output py-5'
                dangerouslySetInnerHTML={descriptionHtml}
              />
              <BaseDivider />
            </div>
          )}
          <BaseButton rightIconName='play' onClick={handleStartActivity}>
            Start Activity
          </BaseButton>
        </div>
      ) : (
        <ActivityGameLoader className='mx-auto' activity={activity} />
      )}
    </div>
  );
});
