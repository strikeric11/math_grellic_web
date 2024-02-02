import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import { convertSecondsToDuration } from '#/utils/time.util';
import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import {
  StudentLessonSingleCard,
  StudentLessonSingleCardSkeleton,
} from '#/lesson/components/student-lesson-single-card.component';

import type { ComponentProps } from 'react';
import type { Lesson, LessonWithDuration } from '#/lesson/models/lesson.model';

type Props = ComponentProps<'div'> & {
  latestLesson: Lesson | null;
  upcomingLessonWithDuration: LessonWithDuration;
  previousLessons: Lesson[];
  loading?: boolean;
};

const LESSON_LIST_PATH = `/${studentBaseRoute}/${studentRoutes.lesson.to}`;

const LessonCompactCard = memo(function ({ lesson }: { lesson: Lesson }) {
  const [singleTo, orderNumber, title, isCompleted, duration] = useMemo(
    () => [
      `${LESSON_LIST_PATH}/${lesson.slug}`,
      lesson.orderNumber,
      lesson.title,
      !!lesson.completions?.length,
      convertSecondsToDuration(lesson.durationSeconds || 0, true),
    ],
    [lesson],
  );

  return (
    <Link to={singleTo} className='group'>
      <BaseSurface className='flex items-start rounded-lg !p-2.5 transition-all group-hover:-translate-y-1 group-hover:ring-1'>
        <div className='flex w-full flex-col gap-2.5'>
          <div className='flex items-center gap-2.5'>
            <BaseChip iconName='chalkboard-teacher' className='text-sm'>
              Lesson {orderNumber}
            </BaseChip>
            <BaseDivider className='!h-6' vertical />
            <BaseChip iconName='hourglass' className='text-sm'>
              {duration}
            </BaseChip>
          </div>
          <h2 className='flex-1 pl-1 font-body text-base font-medium tracking-normal text-accent [.primary_&]:text-white'>
            {title}
          </h2>
        </div>
        <div className='flex justify-center'>
          {!isCompleted ? (
            <BaseIcon
              name='circle-dashed'
              size={30}
              className='text-accent/50 [.primary_&]:text-white/60'
            />
          ) : (
            <div className='relative flex items-center justify-center'>
              <BaseIcon
                name='check-circle'
                weight='fill'
                className='relative z-10 text-green-500'
                size={30}
              />
              <div className='absolute h-6 w-6 bg-white' />
            </div>
          )}
        </div>
      </BaseSurface>
    </Link>
  );
});

export const StudentDashboardLessonList = memo(function ({
  className,
  loading,
  latestLesson,
  upcomingLessonWithDuration: {
    lesson: upcomingLesson,
    duration: upcomingLessonDuration,
  },
  previousLessons,
  ...moreProps
}: Props) {
  const moreLessons = useMemo(
    () => previousLessons.slice(0, 2),
    [previousLessons],
  );

  return (
    <div
      className={cx('w-full', loading && 'flex flex-col gap-2.5', className)}
      {...moreProps}
    >
      {loading ? (
        [...Array(2)].map((_, index) => (
          <StudentLessonSingleCardSkeleton key={index} />
        ))
      ) : (
        <>
          <div className='flex flex-col gap-2.5'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg'>Latest Lessons</h3>
              <BaseLink
                to={LESSON_LIST_PATH}
                rightIconName='arrow-circle-right'
                size='xs'
              >
                View All Lessons
              </BaseLink>
            </div>
            {latestLesson && (
              <StudentLessonSingleCard
                lesson={latestLesson}
                primary
                fat
                isDashboard
              />
            )}
            {upcomingLesson && (
              <StudentLessonSingleCard
                lesson={upcomingLesson}
                upcomingDuration={upcomingLessonDuration}
                primary={!latestLesson}
                fat
                isDashboard
              />
            )}
          </div>
          <BaseDivider className='mb-2.5 pt-4' />
          <div>
            <h3 className='mb-2.5 text-lg'>More Lessons</h3>
            {moreLessons.length ? (
              <ul className='-2lg:flex-row -2lg:gap-5 flex flex-col items-center gap-2.5 xl:flex-col xl:gap-4 2xl:flex-row 2xl:gap-5'>
                {moreLessons.map((lesson) => (
                  <li key={`l-${lesson.id}`} className='w-full'>
                    <LessonCompactCard lesson={lesson} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className='w-full py-4 text-center'>No lessons to show</div>
            )}
          </div>
        </>
      )}
    </div>
  );
});
