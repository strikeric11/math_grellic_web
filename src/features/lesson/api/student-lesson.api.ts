import { transformToLessonCompletion } from '../helpers/lesson-transform.helper';
import { generateApiError } from '#/utils/api.util';
import { queryLessonKey } from '#/config/react-query-keys.config';
import { generateSearchParams, kyInstance } from '#/config/ky.config';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  LessonCompletion,
  StudentLessonList,
} from '../models/lesson.model';

const BASE_URL = 'lessons';

export function getLessonsByCurrentStudentUser(
  q?: string,
  options?: Omit<
    UseQueryOptions<StudentLessonList, Error, StudentLessonList, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/students/list`;
    const searchParams = generateSearchParams({ q });

    try {
      const lessons = await kyInstance.get(url, { searchParams }).json();
      return lessons;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryLessonKey.list, { q }],
    queryFn,
    ...options,
  };
}

export function setLessonCompletion(
  options?: Omit<
    UseMutationOptions<LessonCompletion | null, Error, boolean, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (isCompleted: boolean): Promise<any> => {
    const json = { isCompleted };

    try {
      const lessonCompletion = await kyInstance.post(BASE_URL, { json }).json();
      return lessonCompletion
        ? transformToLessonCompletion(lessonCompletion)
        : null;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
