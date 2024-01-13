import { generateApiError } from '#/utils/api.util';
import {
  queryActivityKey,
  queryExamKey,
  queryLessonKey,
  queryStudentPerformanceKey,
  queryTeacherPerformanceKey,
} from '#/config/react-query-keys.config';
import { generateSearchParams, kyInstance } from '#/config/ky.config';

import type { UseQueryOptions } from '@tanstack/react-query';
import type { QueryPagination } from '#/base/models/base.model';
import type { PaginatedQueryData } from '#/core/models/core.model';
import type { Lesson } from '#/lesson/models/lesson.model';
import type { Exam } from '#/exam/models/exam.model';
import type { Activity } from '#/activity/models/activity.model';
import type {
  StudentPerformance,
  TeacherClassPerformance,
  TeacherLessonPerformance,
  TeacherExamPerformance,
  TeacherActivityPerformance,
} from '../models/performance.model';

const BASE_URL = 'performances/teachers';

export function getClassPerformanceByCurrentTeacherUser(
  options?: Omit<
    UseQueryOptions<
      TeacherClassPerformance,
      Error,
      TeacherClassPerformance,
      any
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    try {
      const classPerformance = await kyInstance.get(`${BASE_URL}/class`).json();
      return classPerformance;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryTeacherPerformanceKey.class],
    queryFn,
    ...options,
  };
}

export function getLessonPerformanceByCurrentTeacherUser(
  options?: Omit<
    UseQueryOptions<
      TeacherLessonPerformance,
      Error,
      TeacherLessonPerformance,
      any
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    try {
      const lessonPerformance = await kyInstance
        .get(`${BASE_URL}/lessons`)
        .json();
      return lessonPerformance;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryTeacherPerformanceKey.lesson],
    queryFn,
    ...options,
  };
}

export function getExamPerformanceByCurrentTeacherUser(
  options?: Omit<
    UseQueryOptions<TeacherExamPerformance, Error, TeacherExamPerformance, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    try {
      const examPerformance = await kyInstance.get(`${BASE_URL}/exams`).json();
      return examPerformance;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryTeacherPerformanceKey.exam],
    queryFn,
    ...options,
  };
}

export function getActivityPerformanceByCurrentTeacherUser(
  options?: Omit<
    UseQueryOptions<
      TeacherActivityPerformance,
      Error,
      TeacherActivityPerformance,
      any
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    try {
      const activityPerformance = await kyInstance
        .get(`${BASE_URL}/activities`)
        .json();
      return activityPerformance;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryTeacherPerformanceKey.activity],
    queryFn,
    ...options,
  };
}

export function getPaginatedStudentPerformancesByCurrentTeacherUser(
  keys?: {
    q?: string;
    performance?: string;
    sort?: string;
    pagination?: Omit<QueryPagination, 'totalCount'>;
  },
  options?: Omit<
    UseQueryOptions<
      PaginatedQueryData<StudentPerformance>,
      Error,
      PaginatedQueryData<StudentPerformance>,
      any
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const { q, performance, sort, pagination } = keys || {};
  const { take, skip } = pagination || {};

  const queryFn = async (): Promise<any> => {
    const searchParams = generateSearchParams({
      q,
      perf: performance,
      sort,
      skip: skip?.toString() || '0',
      take: take?.toString() || '0',
    });

    try {
      const students = await kyInstance
        .get(`${BASE_URL}/students/list`, { searchParams })
        .json();
      return students;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...queryStudentPerformanceKey.list,
      { q, performance, sort, skip, take },
    ],
    queryFn,
    ...options,
  };
}

export function getStudentPerformanceByPublicIdAndCurrentTeacherUser(
  keys: { publicId: string; exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<StudentPerformance, Error, StudentPerformance, any>,
    'queryFn'
  >,
) {
  const { publicId: pId, exclude, include } = keys;
  const publicId = pId.toLowerCase();

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/students/${publicId}`;
    const searchParams = generateSearchParams({ exclude, include });

    try {
      const student = await kyInstance.get(url, { searchParams }).json();
      return student;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...queryStudentPerformanceKey.single,
      { publicId, exclude, include },
    ],
    queryFn,
    ...options,
  };
}

export function getStudentLessonsByPublicIdAndCurrentTeacherUser(
  keys: { publicId: string; exclude?: string; include?: string },
  options?: Omit<UseQueryOptions<Lesson[], Error, Lesson[], any>, 'queryFn'>,
) {
  const { publicId: pId, exclude, include } = keys;
  const publicId = pId.toLowerCase();

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/students/${publicId}/lessons`;
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
    queryKey: [
      ...queryLessonKey.studentPerformance,
      { publicId, exclude, include },
    ],
    queryFn,
    ...options,
  };
}

export function getStudentExamsByPublicIdAndCurrentTeacherUser(
  keys: { publicId: string; exclude?: string; include?: string },
  options?: Omit<UseQueryOptions<Exam[], Error, Exam[], any>, 'queryFn'>,
) {
  const { publicId: pId, exclude, include } = keys;
  const publicId = pId.toLowerCase();

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/students/${publicId}/exams`;
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
    queryKey: [
      ...queryExamKey.studentPerformance,
      { publicId, exclude, include },
    ],
    queryFn,
    ...options,
  };
}

export function getStudentActivitiesByPublicIdAndCurrentTeacherUser(
  keys: { publicId: string; exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<Activity[], Error, Activity[], any>,
    'queryFn'
  >,
) {
  const { publicId: pId, exclude, include } = keys;
  const publicId = pId.toLowerCase();

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/students/${publicId}/activities`;
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
    queryKey: [
      ...queryActivityKey.studentPerformance,
      { publicId, exclude, include },
    ],
    queryFn,
    ...options,
  };
}

export function getStudentExamWithCompletionsByPublicIdAndSlug(
  keys: { publicId: string; slug: string; exclude?: string; include?: string },
  options?: Omit<UseQueryOptions<Exam, Error, Exam, any>, 'queryFn'>,
) {
  const { publicId: pId, slug, exclude, include } = keys;
  const publicId = pId.toLowerCase();

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/students/${publicId}/exams/${slug}`;
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
    queryKey: [...queryExamKey.single, { publicId, slug, exclude, include }],
    queryFn,
    ...options,
  };
}

export function getStudentActivityWithCompletionsByPublicIdAndSlug(
  keys: { publicId: string; slug: string; exclude?: string; include?: string },
  options?: Omit<UseQueryOptions<Activity, Error, Activity, any>, 'queryFn'>,
) {
  const { publicId: pId, slug, exclude, include } = keys;
  const publicId = pId.toLowerCase();

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/students/${publicId}/activities/${slug}`;
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
    queryKey: [
      ...queryActivityKey.single,
      { publicId, slug, exclude, include },
    ],
    queryFn,
    ...options,
  };
}
