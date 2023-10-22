import { generateApiError } from '#/utils/api.util';
import { queryActivityKey } from '#/config/react-query-keys.config';
import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { transformToActivityCategoryCompletion } from '../helpers/activity-transform.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  Activity,
  ActivityCategoryCompletion,
  StudentActivityList,
} from '../models/activity.model';
import type { StudentActivityFormData } from '../models/activity-form-data.model';

const BASE_URL = 'activities';

export function getActivitiesByCurrentStudentUser(
  q?: string,
  options?: Omit<
    UseQueryOptions<StudentActivityList, Error, StudentActivityList, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/students/list`;
    const searchParams = generateSearchParams({ q });

    try {
      const activities = await kyInstance.get(url, { searchParams }).json();
      return activities;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryActivityKey.list, { q }],
    queryFn,
    ...options,
  };
}

export function getActivityBySlugAndCurrentStudentUser(
  keys: { slug: string; exclude?: string; include?: string },
  options?: Omit<UseQueryOptions<Activity, Error, Activity, any>, 'queryFn'>,
) {
  const { slug, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${slug}/students`;
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

export function setActivityCompletion(
  options?: Omit<
    UseMutationOptions<
      ActivityCategoryCompletion | null,
      Error,
      { slug: string; data: StudentActivityFormData },
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
    data: StudentActivityFormData;
  }): Promise<any> => {
    const url = `${BASE_URL}/${slug}/students/completion`;
    const json = { questionAnswers: data.answers };

    try {
      const activityCompletion = await kyInstance.post(url, { json }).json();
      return activityCompletion
        ? transformToActivityCategoryCompletion(activityCompletion)
        : null;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
