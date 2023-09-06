import { memo, useMemo } from 'react';
import { cx } from 'classix';

import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '#/lesson/models/lesson.model';

type Props = ComponentProps<'div'> & {
  lesson: Lesson;
};

export const LessonSingle = memo(function LessonSingle({
  className,
  lesson,
  ...moreProps
}: Props) {
  const orderNumber = useMemo(() => lesson.orderNumber, [lesson]);
  const durationSeconds = useMemo(() => lesson.durationSeconds || 0, [lesson]);

  // TODO lesson single
  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <div className='flex w-full items-center justify-center'>
        <div className='flex items-center'>
          {/* Lesson Number */}
          <div className='flex items-center'>
            <BaseIcon name='chalkboard-teacher' />
            <span className='uppercase'>Lesson {orderNumber}</span>
          </div>
          <BaseDivider vertical />
          {/* Lesson Duration */}
          <div className='flex items-center'>
            <BaseIcon name='hourglass' />
            <span className='uppercase'>{durationSeconds} mins</span>
          </div>
        </div>
      </div>
    </div>
  );
});
