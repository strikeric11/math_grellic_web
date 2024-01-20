import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryAnnouncementKey } from '#/config/react-query-keys.config';
import { createAnnouncement as createAnnouncementApi } from '../api/teacher-announcement.api';

import type { Announcement } from '../models/announcement.model';
import type { AnnouncementUpsertFormData } from '../models/announcement-form-data.model';

type Result = {
  loading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  createAnnouncement: (
    data: AnnouncementUpsertFormData,
  ) => Promise<Announcement>;
};

export function useAnnouncementCreate(): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: createAnnouncement, isLoading: loading } = useMutation(
    createAnnouncementApi({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryAnnouncementKey.list,
        });
      },
    }),
  );

  return {
    loading,
    isDone,
    setIsDone,
    createAnnouncement,
  };
}
