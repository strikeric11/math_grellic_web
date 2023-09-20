import { transformToLessonCompletion } from '../helpers/lesson-transform.helper';
import { generateApiError } from '#/utils/api.util';
import { queryLessonKey } from '#/config/react-query-keys.config';
import { generateSearchParams, kyInstance } from '#/config/ky.config';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  Lesson,
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

export function getLessonBySlugAndCurrentStudentUser(
  keys: { slug: string; exclude?: string; include?: string },
  options?: Omit<UseQueryOptions<Lesson, Error, Lesson, any>, 'queryFn'>,
) {
  const { slug, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${slug}/students`;
    const searchParams = generateSearchParams({ exclude, include });

    try {
      const lesson = await kyInstance.get(url, { searchParams }).json();
      return lesson;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryLessonKey.single, { slug, exclude, include }],
    queryFn,
    ...options,
  };
}

export function setLessonCompletion(
  options?: Omit<
    UseMutationOptions<
      LessonCompletion | null,
      Error,
      { slug: string; isCompleted: boolean },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    slug,
    isCompleted,
  }: {
    slug: string;
    isCompleted: boolean;
  }): Promise<any> => {
    const url = `${BASE_URL}/${slug}/students/completion`;
    const json = { isCompleted };

    try {
      const lessonCompletion = await kyInstance.post(url, { json }).json();
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
