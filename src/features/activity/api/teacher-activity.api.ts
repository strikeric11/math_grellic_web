import { generateApiError } from '#/utils/api.util';
import { queryActivityKey } from '#/config/react-query-keys.config';
import { generateSearchParams, kyInstance } from '#/config/ky.config';

import {
  transformToActivity,
  transformToActivityUpsertDto,
} from '../helpers/activity-transform.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { PaginatedQueryData } from '#/core/models/core.model';
import type { QueryPagination } from '#/base/models/base.model';
import type { Activity, Game } from '../models/activity.model';
import type { ActivityUpsertFormData } from '../models/activity-form-data.model';
import {
  generateImageFormDataStrict,
  generateImageFormData,
} from '../helpers/activity-form.helper';

const BASE_URL = 'activities';

export function getActivityGames(
  options?: Omit<
    UseQueryOptions<Game[], Error, Game[], any>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/games`;

    try {
      const games = await kyInstance.get(url).json();
      return games;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryActivityKey.gameList],
    queryFn,
    ...options,
  };
}

export function getPaginatedActivitiesByCurrentTeacherUser(
  keys?: {
    q?: string;
    status?: string;
    sort?: string;
    pagination?: Omit<QueryPagination, 'totalCount'>;
  },
  options?: Omit<
    UseQueryOptions<
      PaginatedQueryData<Activity>,
      Error,
      PaginatedQueryData<Activity>,
      any
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const { q, status, sort, pagination } = keys || {};
  const { take, skip } = pagination || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/teachers/list`;
    const searchParams = generateSearchParams({
      q,
      status,
      sort,
      skip: skip?.toString() || '0',
      take: take?.toString() || '0',
    });

    try {
      const activities = await kyInstance.get(url, { searchParams }).json();
      return activities;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryActivityKey.list, { q, status, sort, skip, take }],
    queryFn,
    ...options,
  };
}

export function getActivitySnippetsByCurrentTeacherUser(
  take?: number,
  options?: Omit<
    UseQueryOptions<Activity[], Error, Activity[], any>,
    'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/teachers/list/snippets`;
    const searchParams = generateSearchParams({ take: take?.toString() });

    try {
      const activities = await kyInstance.get(url, { searchParams }).json();
      return activities;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryActivityKey.list, { take }],
    queryFn,
    ...options,
  };
}

export function validateUpsertActivity(
  options?: Omit<
    UseMutationOptions<
      boolean,
      Error,
      { data: ActivityUpsertFormData; slug?: string },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    slug,
    data,
  }: {
    data: ActivityUpsertFormData;
    slug?: string;
    scheduleId?: number;
  }): Promise<boolean> => {
    const url = `${BASE_URL}/validate`;
    const json = transformToActivityUpsertDto(data);
    const searchParams = generateSearchParams({
      slug: slug?.toString(),
    });

    try {
      await kyInstance.post(url, { json, searchParams }).json();
      return true;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function createActivity(
  options?: Omit<
    UseMutationOptions<Activity, Error, ActivityUpsertFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: ActivityUpsertFormData): Promise<any> => {
    const json = transformToActivityUpsertDto(data);

    try {
      const activity = await kyInstance.post(BASE_URL, { json }).json();
      return transformToActivity(activity);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function getActivityBySlugAndCurrentTeacherUser(
  keys: { slug: string; status?: string; exclude?: string; include?: string },
  options?: Omit<UseQueryOptions<Activity, Error, Activity, any>, 'queryFn'>,
) {
  const { slug, status, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${slug}/teachers`;
    const searchParams = generateSearchParams({ status, exclude, include });

    try {
      const activity = await kyInstance.get(url, { searchParams }).json();
      return activity;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryActivityKey.single, { slug, status, exclude, include }],
    queryFn,
    ...options,
  };
}

export function editActivity(
  options?: Omit<
    UseMutationOptions<
      Activity,
      Error,
      { slug: string; data: ActivityUpsertFormData },
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
    data: ActivityUpsertFormData;
    scheduleId?: number;
  }): Promise<any> => {
    const url = `${BASE_URL}/${slug}`;
    const json = transformToActivityUpsertDto(data);

    try {
      const activity = await kyInstance.patch(url, { json }).json();
      return transformToActivity(activity);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function deleteActivity(
  options?: Omit<UseMutationOptions<boolean, Error, string, any>, 'mutationFn'>,
) {
  const mutationFn = async (slug: string): Promise<boolean> => {
    const url = `${BASE_URL}/${slug}`;

    try {
      const success: boolean = await kyInstance.delete(url).json();
      return success;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function uploadActivityImages(
  options?: Omit<
    UseMutationOptions<
      string[],
      Error,
      { data: ActivityUpsertFormData; strict?: boolean },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async (options: {
    data: ActivityUpsertFormData;
    strict?: boolean;
  }): Promise<any> => {
    const { data, strict } = options;
    const url = `upload/${BASE_URL}/images`;
    const formData = await (strict
      ? generateImageFormDataStrict(data)
      : generateImageFormData(data));

    try {
      return kyInstance.post(url, { body: formData }).json();
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
