import { memo, useMemo } from 'react';
import DOMPurify from 'dompurify';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
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
      <div className='flex w-full flex-col flex-wrap items-start justify-between gap-2.5 -3xs:flex-row -2lg:flex-nowrap -2lg:items-center'>
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
      <div className='mt-2.5 flex flex-col gap-y-2.5'>
        <BaseDivider />
        <BaseSurface
          className='flex w-full items-center justify-between'
          rounded='sm'
        >
          {scheduleDate ? (
            <div className='flex flex-col items-start gap-1 xs:flex-row xs:items-center xs:gap-2.5'>
              <h3 className='mb-1 text-base xs:mb-0 xs:mr-2'>Schedule</h3>
              <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
              <BaseDivider className='hidden !h-6 xs:block' vertical />
              <BaseChip iconName='clock'>{scheduleTime}</BaseChip>
            </div>
          ) : (
            <h3 className='text-base'>Lesson has no schedule</h3>
          )}
          {!isDraft && (
            <BaseLink to={teacherRoutes.lesson.schedule.to} size='sm' bodyFont>
              Set Schedule
            </BaseLink>
          )}
        </BaseSurface>
        <BaseSurface className='flex flex-col gap-y-2.5' rounded='sm'>
          <div>
            <h3 className='mb-2.5 text-base'>Video</h3>
            <LessonVideo url={videoUrl} title={title} />
          </div>
          <BaseDivider />
          <div className='flex flex-col items-start gap-2.5 md:flex-row md:gap-0'>
            <div className='mr-4 flex-1 border-0 border-accent/20 md:border-r'>
              <h3 className='block text-base'>
                {descriptionHtml ? 'Description' : 'Lesson has no description'}
              </h3>
              {descriptionHtml && (
                <div
                  className='base-rich-text rt-output pr-2.5'
                  dangerouslySetInnerHTML={descriptionHtml}
                />
              )}
            </div>
            <BaseDivider className='block md:hidden' />
            <div className='flex-1'>
              <h3 className='text-base'>
                {excerpt ? 'Excerpt' : 'Lesson has no excerpt'}
              </h3>
              {excerpt && <p className='my-2'>{excerpt}</p>}
            </div>
          </div>
        </BaseSurface>
      </div>
    </div>
  );
});
