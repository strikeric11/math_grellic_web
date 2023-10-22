import { memo, useMemo } from 'react';
import DOMPurify from 'dompurify';
import dayjs from 'dayjs';
import cx from 'classix';

import { convertSecondsToDuration } from '#/utils/time.util';
import { RecordStatus } from '#/core/models/core.model';
import { teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { LessonVideo } from './lesson-video.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '../models/lesson.model';

type Props = ComponentProps<'div'> & {
  lesson: Lesson;
};

export const TeacherLessonSingle = memo(function ({
  className,
  lesson,
  ...moreProps
}: Props) {
  const [orderNumber, title, videoUrl, duration, isDraft, excerpt] = useMemo(
    () => [
      lesson.orderNumber,
      lesson.title,
      lesson.videoUrl,
      convertSecondsToDuration(lesson.durationSeconds || 0, true),
      lesson.status === RecordStatus.Draft,
      lesson.excerpt,
    ],
    [lesson],
  );

  const descriptionHtml = useMemo(() => {
    const isEmpty = !DOMPurify.sanitize(lesson.description || '', {
      ALLOWED_TAGS: [],
    }).trim();

    return !isEmpty
      ? {
          __html: DOMPurify.sanitize(lesson.description || ''),
        }
      : null;
  }, [lesson]);

  const [scheduleDate, scheduleTime] = useMemo(() => {
    if (!lesson.schedules?.length) {
      return [];
    }

    return [
      dayjs(lesson.schedules[0].startDate).format('MMM DD, YYYY'),
      dayjs(lesson.schedules[0].startDate).format('hh:mm A'),
    ];
  }, [lesson]);

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <div className='flex w-full items-center justify-between'>
        <div>
          <h2 className='pb-1 text-xl'>{title}</h2>
          <div className='flex items-center gap-2.5'>
            <BaseChip iconName='chalkboard-teacher'>
              Lesson {orderNumber}
            </BaseChip>
            <BaseDivider className='!h-6' vertical />
            <BaseChip iconName='hourglass'>{duration}</BaseChip>
            {isDraft && (
              <>
                <BaseDivider className='!h-6' vertical />
                <BaseChip iconName='file-dashed'>Draft</BaseChip>
              </>
            )}
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <BaseLink
            to={teacherRoutes.lesson.previewTo}
            className='!px-3'
            variant='solid'
            target='_blank'
          >
            <BaseIcon name='file-text' size={24} />
          </BaseLink>
          <BaseLink
            to={teacherRoutes.lesson.editTo}
            className='!px-3'
            variant='solid'
          >
            <BaseIcon name='pencil' size={24} />
          </BaseLink>
        </div>
      </div>
      <div className='my-4 flex w-full items-center justify-between rounded border-b border-t border-accent/20 px-4 py-3'>
        {scheduleDate ? (
          <div className='flex items-center gap-2.5'>
            <span className='mr-2 font-bold'>Schedule</span>
            <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
            <BaseDivider className='!h-6' vertical />
            <BaseChip iconName='clock'>{scheduleTime}</BaseChip>
          </div>
        ) : (
          <span>Lesson has no schedule</span>
        )}
        {!isDraft && (
          <BaseLink to={teacherRoutes.lesson.schedule.to} size='sm' bodyFont>
            Set Schedule
          </BaseLink>
        )}
      </div>
      <LessonVideo className='my-8' url={videoUrl} title={title} />
      <div className='my-4 flex flex-col gap-y-3'>
        <BaseSurface className='w-full rounded !px-4' rounded='sm'>
          <span className='block font-bold'>
            {excerpt ? 'Excerpt' : 'Lesson has no excerpt'}
          </span>
          {excerpt}
        </BaseSurface>
        <BaseSurface className='w-full rounded px-4' rounded='sm'>
          <span className='block font-bold'>
            {descriptionHtml ? 'Description' : 'Lesson has no description'}
          </span>
          {descriptionHtml && (
            <div
              className='base-rich-text rt-output'
              dangerouslySetInnerHTML={descriptionHtml}
            />
          )}
        </BaseSurface>
      </div>
    </div>
  );
});
