import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import cx from 'classix';

import { transformToExam } from '#/exam/helpers/exam-transform.helper';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { getStudentExamsByCurrentStudentUser } from '../api/student-performance.api';
import { StudentExamPerformanceDetails } from './student-exam-performance-details.component';

import type { ComponentProps } from 'react';
import type { Exam } from '#/exam/models/exam.model';

type Props = ComponentProps<'div'> & {
  onExamClick: (exam?: Exam) => void;
};

export const StudentExamPerformanceList = memo(function ({
  className,
  onExamClick,
  ...moreProps
}: Props) {
  const {
    data: exams,
    isFetching,
    isLoading,
  } = useQuery(
    getStudentExamsByCurrentStudentUser(
      {},
      {
        refetchOnWindowFocus: false,
        initialData: [],
        select: (data: unknown) =>
          Array.isArray(data)
            ? data.map((item: any) => transformToExam(item))
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
      {exams?.map((exam, index) => (
        <StudentExamPerformanceDetails
          key={exam.slug}
          exam={exam}
          onClick={onExamClick}
          last={index >= exams.length - 1}
        />
      ))}
    </div>
  );
});
