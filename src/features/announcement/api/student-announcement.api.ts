import { generateApiError } from '#/utils/api.util';
import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryAnnouncementKey } from '#/config/react-query-keys.config';

import type { UseQueryOptions } from '@tanstack/react-query';
import type {
  Announcement,
  StudentAnnouncements,
} from '../models/announcement.model';

const BASE_URL = 'announcements';

export function getAnnouncementsByCurrentStudentUser(
  options?: Omit<
    UseQueryOptions<StudentAnnouncements, Error, StudentAnnouncements, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/students/list`;

    try {
      const studentAnnouncements = await kyInstance.get(url).json();
      return studentAnnouncements;
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

export function getAnnouncementByIdAndStudentTeacherUser(
  keys: { id: number; exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<Announcement, Error, Announcement, any>,
    'queryFn'
  >,
) {
  const { id, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${id}/students`;
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
