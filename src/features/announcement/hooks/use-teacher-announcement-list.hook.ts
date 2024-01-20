import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getAnnouncementsByCurrentTeacherUser } from '../api/teacher-announcement.api';
import { transformToTeacherAnnouncements } from '../helpers/announcement-transform.helper';

import type { TeacherAnnouncements } from '../models/announcement.model';

type Result = {
  teacherAnnouncements: TeacherAnnouncements;
  loading: boolean;
  refresh: () => void;
};

export function useTeacherAnnouncementList(): Result {
  const {
    data,
    isLoading,
    isRefetching,
    refetch: refresh,
  } = useQuery(
    getAnnouncementsByCurrentTeacherUser({
      refetchOnWindowFocus: false,
      select: (data: any) => transformToTeacherAnnouncements(data),
    }),
  );

  const teacherAnnouncements = useMemo(
    () =>
      data || {
        currentAnnouncements: [],
        upcomingAnnouncements: [],
      },
    [data],
  );

  return {
    loading: isLoading || isRefetching,
    teacherAnnouncements,
    refresh,
  };
}
