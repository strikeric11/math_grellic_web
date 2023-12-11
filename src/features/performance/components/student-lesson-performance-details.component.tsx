import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classix';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseTag } from '#/base/components/base-tag.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '#/lesson/models/lesson.model';

type Props = Omit<ComponentProps<'div'>, 'onClick'> & {
  lesson: Lesson;
  isUpcoming?: boolean;
  isStudent?: boolean;
};

export const StudentLessonPerformanceDetails = memo(function ({
  className,
  lesson,
  isUpcoming,
  isStudent,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const [orderNumber, title, slug, hasCompleted] = useMemo(
    () => [
      lesson.orderNumber,
      lesson.title,
      lesson.slug,
      !!lesson.completions?.length,
    ],
    [lesson],
  );

  const statusText = useMemo(() => {
    if (isUpcoming) {
      return 'Upcoming';
    }
    return hasCompleted ? 'Completed' : 'Pending';
  }, [hasCompleted, isUpcoming]);

  const handleClick = useCallback(() => {
    const to = isStudent
      ? `/${studentBaseRoute}/${studentRoutes.lesson.to}/${slug}`
      : `/${teacherBaseRoute}/${teacherRoutes.lesson.to}/${slug}`;

    navigate(to);
  }, [slug, isStudent, navigate]);

  return (
    <div
      className={cx(
        'group flex w-full cursor-pointer items-center justify-between overflow-hidden rounded px-4 py-2 transition-colors duration-75 hover:bg-primary-focus hover:!text-white',
        className,
      )}
      onClick={handleClick}
      {...moreProps}
    >
      <div className='flex items-center gap-x-2.5'>
        {hasCompleted ? (
          <BaseIcon
            className='text-green-500'
            name='check-circle'
            size={28}
            weight='bold'
          />
        ) : (
          <BaseIcon
            className={!isUpcoming ? 'text-red-500' : 'text-accent/40'}
            name='x-circle'
            size={28}
            weight='bold'
          />
        )}
        <span>
          Lesson {orderNumber} - {title}
        </span>
      </div>
      <div className='flex items-center gap-x-4 text-primary group-hover:text-white'>
        <BaseTag className='w-28 !bg-primary'>{statusText}</BaseTag>
      </div>
    </div>
  );
});
