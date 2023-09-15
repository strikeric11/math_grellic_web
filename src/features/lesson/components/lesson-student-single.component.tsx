import { memo, useMemo } from 'react';
import DOMPurify from 'dompurify';
import { cx } from 'classix';

import { convertSecondsToDuration } from '#/utils/time.util';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { LessonVideo } from './lesson-video.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '#/lesson/models/lesson.model';

type Props = ComponentProps<'div'> & {
  lesson: Lesson;
  isCompleted?: boolean;
  preview?: boolean;
};

export const LessonStudentSingle = memo(function LessonSingle({
  className,
  lesson,
  isCompleted,
  preview,
  ...moreProps
}: Props) {
  const orderNumber = useMemo(() => lesson.orderNumber, [lesson]);
  const title = useMemo(() => lesson.title, [lesson]);
  const videoUrl = useMemo(() => lesson.videoUrl, [lesson]);
  const duration = useMemo(
    () => convertSecondsToDuration(lesson.durationSeconds || 0, true),
    [lesson],
  );
  const descriptionHtml = useMemo(
    () => ({ __html: DOMPurify.sanitize(lesson.description || '') }),
    [lesson],
  );

  return (
    <div
      className={cx('flex w-full flex-col items-center', className)}
      {...moreProps}
    >
      <LessonVideo className='mb-8 mt-5' url={videoUrl} title={title} />
      <div className='w-full max-w-compact px-4'>
        <div className='flex w-full items-center justify-between rounded-lg border border-primary-border-light bg-white px-5 py-2.5'>
          <div className='flex items-center gap-2.5'>
            <BaseChip iconName='chalkboard-teacher'>
              Lesson {orderNumber}
            </BaseChip>
            <BaseDivider className='!h-6' vertical />
            <BaseChip iconName='hourglass'>{duration}</BaseChip>
          </div>
          <div className='flex items-center gap-2.5'>
            {isCompleted ? (
              <BaseIcon
                name='check-circle'
                className='text-green-500'
                size={36}
                weight='fill'
              />
            ) : (
              <BaseIcon
                name='circle-dashed'
                className='text-black/40'
                size={36}
              />
            )}
            <BaseButton disabled={preview}>Mark Lesson as Completed</BaseButton>
          </div>
        </div>
        <div
          className='base-rich-text rt-output py-8'
          dangerouslySetInnerHTML={descriptionHtml}
        />
      </div>
    </div>
  );
});
