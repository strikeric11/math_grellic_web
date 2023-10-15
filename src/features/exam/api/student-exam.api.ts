import { generateApiError } from '#/utils/api.util';
import { queryExamKey } from '#/config/react-query-keys.config';
import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { transformToExamCompletion } from '../helpers/exam-transform.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  Exam,
  ExamCompletion,
  StudentExamList,
} from '../models/exam.model';
import type { StudentExamFormData } from '../models/exam-form-data.model';

const BASE_URL = 'exams';

export function getExamsByCurrentStudentUser(
  q?: string,
  options?: Omit<
    UseQueryOptions<StudentExamList, Error, StudentExamList, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/students/list`;
    const searchParams = generateSearchParams({ q });

    try {
      const exams = await kyInstance.get(url, { searchParams }).json();
      return exams;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryExamKey.list, { q }],
    queryFn,
    ...options,
  };
}

export function getExamBySlugAndCurrentStudentUser(
  keys: { slug: string; exclude?: string; include?: string },
  options?: Omit<UseQueryOptions<Exam, Error, Exam, any>, 'queryFn'>,
) {
  const { slug, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${slug}/students`;
    const searchParams = generateSearchParams({ exclude, include });

    try {
      const exam = await kyInstance.get(url, { searchParams }).json();
      return exam;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryExamKey.single, { slug, exclude, include }],
    queryFn,
    ...options,
  };
}

export function setExamCompletion(
  options?: Omit<
    UseMutationOptions<
      ExamCompletion | null,
      Error,
      { slug: string; data: StudentExamFormData },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    slug,
    data,
  }: {
    slug: string;
    data: StudentExamFormData;
  }): Promise<any> => {
    const url = `${BASE_URL}/${slug}/students/completion`;
    const json = { questionAnswers: data.answers };

    try {
      const examCompletion = await kyInstance.post(url, { json }).json();
      return examCompletion ? transformToExamCompletion(examCompletion) : null;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
