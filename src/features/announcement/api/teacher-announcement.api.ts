import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryAnnouncementKey } from '#/config/react-query-keys.config';
import { generateApiError } from '#/utils/api.util';
import {
  transformToAnnouncementUpsertDto,
  transformToAnnouncement,
} from '../helpers/announcement-transform.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  Announcement,
  TeacherAnnouncements,
} from '../models/announcement.model';
import type { AnnouncementUpsertFormData } from '../models/announcement-form-data.model';

const BASE_URL = 'announcements';

export function getAnnouncementsByCurrentTeacherUser(
  options?: Omit<
    UseQueryOptions<TeacherAnnouncements, Error, TeacherAnnouncements, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/teachers/list`;

    try {
      const teacherAnnouncements = await kyInstance.get(url).json();
      return teacherAnnouncements;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryAnnouncementKey.list],
    queryFn,
    ...options,
  };
}

export function getAnnouncementByIdAndCurrentTeacherUser(
  keys: { id: number; exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<Announcement, Error, Announcement, any>,
    'queryFn'
  >,
) {
  const { id, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${id}/teachers`;
    const searchParams = generateSearchParams({ exclude, include });

    try {
      const announcement = await kyInstance.get(url, { searchParams }).json();
      return announcement;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryAnnouncementKey.single, { id, exclude, include }],
    queryFn,
    ...options,
  };
}

export function createAnnouncement(
  options?: Omit<
    UseMutationOptions<Announcement, Error, AnnouncementUpsertFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: AnnouncementUpsertFormData): Promise<any> => {
    const json = transformToAnnouncementUpsertDto(data);

    try {
      const announcement = await kyInstance.post(BASE_URL, { json }).json();
      return transformToAnnouncement(announcement);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function editAnnouncement(
  options?: Omit<
    UseMutationOptions<
      Announcement,
      Error,
      { id: number; data: AnnouncementUpsertFormData },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    id,
    data,
  }: {
    id: number;
    data: AnnouncementUpsertFormData;
  }): Promise<any> => {
    const url = `${BASE_URL}/${id}`;
    const json = transformToAnnouncementUpsertDto(data);

    try {
      const announcement = await kyInstance.patch(url, { json }).json();
      return transformToAnnouncement(announcement);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function deleteAnnouncement(
  options?: Omit<UseMutationOptions<boolean, Error, number, any>, 'mutationFn'>,
) {
  const mutationFn = async (id: number): Promise<boolean> => {
    const url = `${BASE_URL}/${id}`;

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
