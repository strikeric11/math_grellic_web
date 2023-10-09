import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getExamBySlugAndCurrentTeacherUser } from '../api/teacher-exam.api';
import { transformToExam } from '../helpers/exam-transform.helper';

import type { Exam } from '../models/exam.model';
import { useMemo } from 'react';

type Result = {
  title?: string;
  exam?: Exam | null;
};

export function useTeacherExamSingle(): Result {
  const { slug } = useParams();

  const { data: exam } = useQuery(
    getExamBySlugAndCurrentTeacherUser(
      { slug: slug || '' },
      {
        enabled: !!slug,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToExam(data, true);
        },
      },
    ),
  );

  const title = useMemo(() => exam?.title, [exam]);

  return { title, exam };
}
