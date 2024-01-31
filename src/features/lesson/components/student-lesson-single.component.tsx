import { memo, useCallback, useMemo } from 'react';
import DOMPurify from 'dompurify';
import toast from 'react-hot-toast';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import {
  convertSecondsToDuration,
  generateCountdownDate,
} from '#/utils/time.util';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { LessonVideo } from './lesson-video.component';

import type { ComponentProps } from 'react';
import type { Duration } from 'dayjs/plugin/duration';
import type { Lesson, LessonCompletion } from '#/lesson/models/lesson.model';

type Props = ComponentProps<'div'> & {
  lesson: Lesson;
  loading?: boolean;
  preview?: boolean;
  upcomingDuration?: Duration | null;
  onSetCompletion?: (isComplete: boolean) => Promise<LessonCompletion | null>;
};

export const StudentLessonSingle = memo(function ({
  className,
  loading,
  lesson,
  preview,
  upcomingDuration,
  onSetCompletion,
  ...moreProps
}: Props) {
  const [
    orderNumber,
    title,
    videoUrl,
    excerpt,
    isCompleted,
    duration,
    descriptionHtml,
  ] = useMemo(
    () => [
      lesson.orderNumber,
      lesson.title,
      lesson.videoUrl,
      lesson.excerpt,
      !!lesson.completions?.length,
      convertSecondsToDuration(lesson.durationSeconds || 0, true),
      { __html: DOMPurify.sanitize(lesson.description || '') },
    ],
    [lesson],
  );

  const [scheduleDate, scheduleTime] = useMemo(() => {
    if (!lesson.schedules?.length) {
      return [];
    }

    return [
      dayjs(lesson.schedules[0].startDate).format('MMM DD, YYYY'),
      dayjs(lesson.schedules[0].startDate).format('hh:mm A'),
    ];
  }, [lesson]);

  const markAsButtonLabel = useMemo(
    () =>
      isCompleted ? 'Unmark Lesson as Completed' : 'Mark Lesson as Completed',
    [isCompleted],
  );

  const formattedUpcomingDate = useMemo(() => {
    if (!upcomingDuration) {
      return null;
    }
    return generateCountdownDate(upcomingDuration);
  }, [upcomingDuration]);

  const handleOnSetCompletion = useCallback(async () => {
    if (preview || upcomingDuration || !onSetCompletion) {
      return;
    }

    try {
      const result = await onSetCompletion(!isCompleted);
      toast.success(
        result ? 'Lesson marked as completed' : 'Lesson unmarked as completed',
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [preview, upcomingDuration, isCompleted, onSetCompletion]);

  return (
    <div
      className={cx('flex w-full flex-col items-center', className)}
      {...moreProps}
    >
      {formattedUpcomingDate ? (
        <div className='mb-8 mt-5 h-[500px] w-full overflow-hidden rounded-lg bg-black'>
          <div className='mx-auto flex h-full w-full max-w-compact flex-col items-center justify-center bg-blue-100/70'>
            <div className='min-w-[276px]'>
              <small className='mb-1 flex w-full items-center justify-end text-base font-medium uppercase text-white'>
                <span className='relative mr-4 flex gap-1'>
                  <span className='relative inline-flex h-2.5 w-2.5 animate-bounce rounded-full bg-white'></span>
                  <span className='relative inline-flex h-2.5 w-2.5 animate-bounce rounded-full bg-white animation-delay-100'></span>
                  <span className='relative inline-flex h-2.5 w-2.5 animate-bounce rounded-full bg-white animation-delay-200'></span>
                </span>
                Available In
              </small>
              <div className='w-full overflow-hidden rounded border border-accent drop-shadow-primary'>
                <div className='flex min-h-[24px] w-full items-center justify-center bg-primary'>
                  <span className='px-5 py-0.5 text-lg font-medium uppercase text-white'>
                    {formattedUpcomingDate}
                  </span>
                </div>
                <div className='flex w-full items-center justify-center gap-2.5 border-t border-t-accent bg-white'>
                  <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
                  <BaseDivider className='!h-6' vertical />
                  <BaseChip iconName='calendar-check'>{scheduleTime}</BaseChip>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LessonVideo className='mb-8 mt-5' url={videoUrl} title={title} />
      )}
      <div className='w-full max-w-compact px-4'>
        <div className='flex w-full flex-col items-center justify-between gap-2.5 rounded-lg border border-primary-border-light bg-white px-5 py-2.5 md:h-[70px] md:flex-row md:gap-0'>
          <div className='flex items-center gap-2.5'>
            <BaseChip iconName='chalkboard-teacher'>
              Lesson {orderNumber}
            </BaseChip>
            <BaseDivider className='!h-6' vertical />
            <BaseChip iconName='hourglass'>{duration}</BaseChip>
          </div>
          {!formattedUpcomingDate && (
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
              <BaseButton
                className='w-72'
                loading={loading}
                disabled={preview}
                onClick={handleOnSetCompletion}
              >
                {markAsButtonLabel}
              </BaseButton>
            </div>
          )}
        </div>
        {formattedUpcomingDate ? (
          <div className='w-full py-8'>{excerpt}</div>
        ) : (
          <div
            className='base-rich-text rt-output py-8'
            dangerouslySetInnerHTML={descriptionHtml}
          />
        )}
      </div>
    </div>
  );
});
