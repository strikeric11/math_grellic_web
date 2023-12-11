import { memo, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { transformToLesson } from '#/lesson/helpers/lesson-transform.helper';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { getStudentLessonsByPublicIdAndCurrentTeacherUser } from '../api/teacher-performance.api';
import { StudentLessonPerformanceDetails } from './student-lesson-performance-details.component';

import type { ComponentProps } from 'react';

export const TeacherStudentLessonPerformanceList = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'div'>) {
  const { publicId } = useParams();

  const {
    data: lessons,
    isFetching,
    isLoading,
  } = useQuery(
    getStudentLessonsByPublicIdAndCurrentTeacherUser(
      { publicId: publicId || '' },
      {
        refetchOnWindowFocus: false,
        enabled: !!publicId,
        initialData: [],
        select: (data: unknown) =>
          Array.isArray(data)
            ? data.map((item: any) => transformToLesson(item))
            : [],
      },
    ),
  );

  const currentLessons = useMemo(
    () =>
      lessons?.filter((lesson) => {
        const currentDate = dayjs().toDate();

        if (!lesson.schedules?.length) {
          return false;
        }

        return (
          dayjs(lesson.schedules[0].startDate).isSame(currentDate, 'date') ||
          dayjs(lesson.schedules[0].startDate).isBefore(currentDate, 'date')
        );
      }) || [],
    [lessons],
  );

  const upcomingLessons = useMemo(
    () =>
      lessons?.filter((lesson) => {
        const currentDate = dayjs().toDate();

        return (
          !!lesson.schedules?.length &&
          dayjs(lesson.schedules[0].startDate).isAfter(currentDate, 'date')
        );
      }) || [],
    [lessons],
  );

  if (isFetching || isLoading) {
    return (
      <div className='mt-5 flex w-full justify-center'>
        <BaseSpinner />
      </div>
    );
  }

  return (
    <div className={cx('flex flex-col py-2.5', className)} {...moreProps}>
      {currentLessons?.map((lesson) => (
        <StudentLessonPerformanceDetails
          key={`cl-${lesson.slug}`}
          lesson={lesson}
        />
      ))}
      {upcomingLessons?.map((lesson) => (
        <StudentLessonPerformanceDetails
          key={`ul-${lesson.slug}`}
          lesson={lesson}
          isUpcoming
        />
      ))}
    </div>
  );
});
