import { memo, useMemo } from 'react';
import DOMPurify from 'dompurify';
import cx from 'classix';

import { convertSecondsToDuration } from '#/utils/time.util';
import { teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseIcon } from '#/base/components/base-icon.component';
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
  const orderNumber = useMemo(() => lesson.orderNumber, [lesson]);
  const title = useMemo(() => lesson.title, [lesson]);
  const videoUrl = useMemo(() => lesson.videoUrl, [lesson]);
  const duration = useMemo(
    () => convertSecondsToDuration(lesson.durationSeconds || 0, true),
    [lesson],
  );
  const descriptionHtml = useMemo(
    () => ({
      __html: DOMPurify.sanitize(
        lesson.description ||
          "<span class='text-lg font-bold'>No description available</span>",
      ),
    }),
    [lesson],
  );
  // const schedules = useMemo(() => lesson.schedules, [lesson]);

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <div className='flex w-full items-center justify-between'>
        <div>
          <h2 className='text-xl'>{title}</h2>
          <div className='flex items-center gap-2.5'>
            <BaseChip iconName='chalkboard-teacher'>
              Lesson {orderNumber}
            </BaseChip>
            <BaseDivider className='!h-6' vertical />
            <BaseChip iconName='hourglass'>{duration}</BaseChip>
          </div>
        </div>
        <div className='flex items-center gap-x-2'>
          <BaseLink
            to={teacherRoutes.lesson.editTo}
            className='!px-3'
            variant='solid'
          >
            <BaseIcon name='pencil' size={24} />
          </BaseLink>
          <BaseLink
            to={teacherRoutes.lesson.previewTo}
            className='!px-3'
            variant='solid'
            target='_blank'
          >
            <BaseIcon name='file-text' size={24} />
          </BaseLink>
        </div>
      </div>
      <LessonVideo className='my-8' url={videoUrl} title={title} />
      <div
        className='base-rich-text rt-output'
        dangerouslySetInnerHTML={descriptionHtml}
      />
      {/* LOAD schedules */}
    </div>
  );
});
