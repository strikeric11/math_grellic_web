import { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import cx from 'classix';

import { transformToExam } from '#/exam/helpers/exam-transform.helper';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { getStudentExamsByPublicIdAndCurrentTeacherUser } from '../api/teacher-performance.api';
import { StudentExamPerformanceDetails } from './student-exam-performance-details.component';

import type { ComponentProps } from 'react';
import type { Exam } from '#/exam/models/exam.model';

type Props = ComponentProps<'div'> & {
  onExamClick: (exam?: Exam) => void;
};

export const TeacherStudentExamPerformanceList = memo(function ({
  className,
  onExamClick,
  ...moreProps
}: Props) {
  const { publicId } = useParams();

  const {
    data: exams,
    isFetching,
    isLoading,
  } = useQuery(
    getStudentExamsByPublicIdAndCurrentTeacherUser(
      { publicId: publicId || '' },
      {
        refetchOnWindowFocus: false,
        enabled: !!publicId,
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
      {exams?.map((exam) => (
        <StudentExamPerformanceDetails
          key={exam.slug}
          exam={exam}
          onClick={onExamClick}
        />
      ))}
    </div>
  );
});
