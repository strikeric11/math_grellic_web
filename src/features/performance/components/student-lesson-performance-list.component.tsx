import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import cx from 'classix';

import { BaseSpinner } from '#/base/components/base-spinner.component';

import { transformToLesson } from '#/lesson/helpers/lesson-transform.helper';
import { getStudentLessonsByCurrentStudentUser } from '../api/student-performance.api';
import { StudentLessonPerformanceDetails } from './student-lesson-performance-details.component';

import type { ComponentProps } from 'react';

export const StudentLessonPerformanceList = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'div'>) {
  const {
    data: lessons,
    isFetching,
    isLoading,
  } = useQuery(
    getStudentLessonsByCurrentStudentUser(
      {},
      {
        refetchOnWindowFocus: false,
        initialData: [],
        select: (data: unknown) =>
          Array.isArray(data)
            ? data.map((item: any) => transformToLesson(item))
            : [],
      },
    ),
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
      {lessons?.map((lesson) => (
        <StudentLessonPerformanceDetails
          key={lesson.slug}
          lesson={lesson}
          isStudent
        />
      ))}
    </div>
  );
});
