import { memo, useMemo } from 'react';
import DOMPurify from 'dompurify';
import cx from 'classix';

import { BaseButton } from '#/base/components/base-button.components';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { LessonItem } from '#/lesson/components/lesson-picker-list.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '#/lesson/models/lesson.model';

type Props = ComponentProps<'div'> & {
  onStart: () => void;
  description?: string;
  coveredLessons?: Partial<Lesson>[];
};

export const StudentExamTakeStart = memo(function ({
  className,
  description,
  coveredLessons,
  onStart,
  ...moreProps
}: Props) {
  const descriptionHtml = useMemo(() => {
    const isEmpty = !DOMPurify.sanitize(description || '', {
      ALLOWED_TAGS: [],
    }).trim();

    return !isEmpty
      ? {
          __html: DOMPurify.sanitize(description || ''),
        }
      : null;
  }, [description]);

  return (
    <div
      className={cx('flex w-full flex-col items-center gap-y-8 p-4', className)}
      {...moreProps}
    >
      <BaseSurface className='w-full bg-white px-4' rounded='sm'>
        <span className='mb-4 block font-medium'>Covered Lessons</span>
        {coveredLessons?.length ? (
          <div className='flex flex-col'>
            {coveredLessons?.map((lesson) => (
              <LessonItem key={`li-${lesson.id}`} lesson={lesson as Lesson} />
            ))}
          </div>
        ) : (
          <div className='flex w-full justify-center'>None</div>
        )}
      </BaseSurface>
      {descriptionHtml && (
        <div className='w-full'>
          <BaseDivider />
          <div
            className='base-rich-text rt-output py-5'
            dangerouslySetInnerHTML={descriptionHtml}
          />
          <BaseDivider />
        </div>
      )}
      <BaseButton rightIconName='play' onClick={onStart}>
        Start Exam
      </BaseButton>
    </div>
  );
});
