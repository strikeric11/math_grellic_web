import { generateApiError } from '#/utils/api.util';
import { generateSearchParams, kyInstance } from '#/config/ky.config';
import {
  queryActivityKey,
  queryExamKey,
  queryLessonKey,
  queryStudentPerformanceKey,
} from '#/config/react-query-keys.config';

import type { UseQueryOptions } from '@tanstack/react-query';
import type { Lesson } from '#/lesson/models/lesson.model';
import type { Exam } from '#/exam/models/exam.model';
import type { Activity } from '#/activity/models/activity.model';
import type { StudentPerformance } from '../models/performance.model';

const BASE_URL = 'performances/students';

export function getStudentPerformanceByCurrentStudentUser(
  keys: { exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<StudentPerformance, Error, StudentPerformance, any>,
    'queryFn'
  >,
) {
  const { exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const searchParams = generateSearchParams({ exclude, include });

    try {
      const student = await kyInstance.get(BASE_URL, { searchParams }).json();
      return student;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryStudentPerformanceKey.single, { exclude, include }],
    queryFn,
    ...options,
  };
}

export function getStudentLessonsByCurrentStudentUser(
  keys: { exclude?: string; include?: string },
  options?: Omit<UseQueryOptions<Lesson[], Error, Lesson[], any>, 'queryFn'>,
) {
  const { exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/lessons`;
    const searchParams = generateSearchParams({ exclude, include });

    try {
      const lessons = await kyInstance.get(url, { searchParams }).json();
      return lessons;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryLessonKey.studentPerformance, { exclude, include }],
    queryFn,
    ...options,
  };
}

export function getStudentExamsByCurrentStudentUser(
  keys: { exclude?: string; include?: string },
  options?: Omit<UseQueryOptions<Exam[], Error, Exam[], any>, 'queryFn'>,
) {
  const { exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/exams`;
    const searchParams = generateSearchParams({ exclude, include });

    try {
      const exams = await kyInstance.get(url, { searchParams }).json();
      return exams;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryExamKey.studentPerformance, { exclude, include }],
    queryFn,
    ...options,
  };
}

export function getStudentActivitiesByCurrentStudentUser(
  keys: { exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<Activity[], Error, Activity[], any>,
    'queryFn'
  >,
) {
  const { exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/activities`;
    const searchParams = generateSearchParams({ exclude, include });

    try {
      const activities = await kyInstance.get(url, { searchParams }).json();
      return activities;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryActivityKey.studentPerformance, { exclude, include }],
    queryFn,
    ...options,
  };
}

export function getStudentExamWithCompletionsBySlugAndCurrentStudentUser(
  keys: { slug: string; exclude?: string; include?: string },
  options?: Omit<UseQueryOptions<Exam, Error, Exam, any>, 'queryFn'>,
) {
  const { slug, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/exams/${slug}`;
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

export function getStudentActivityWithCompletionsBySlugAndCurrentStudentUser(
  keys: { slug: string; exclude?: string; include?: string },
  options?: Omit<UseQueryOptions<Activity, Error, Activity, any>, 'queryFn'>,
) {
  const { slug, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/activities/${slug}`;
    const searchParams = generateSearchParams({ exclude, include });

    try {
      const activity = await kyInstance.get(url, { searchParams }).json();
      return activity;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryActivityKey.single, { slug, exclude, include }],
    queryFn,
    ...options,
  };
}
