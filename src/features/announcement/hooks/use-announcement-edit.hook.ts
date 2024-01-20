import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { queryAnnouncementKey } from '#/config/react-query-keys.config';
import { queryClient } from '#/config/react-query-client.config';
import {
  deleteAnnouncement as deleteAnnouncementApi,
  editAnnouncement as editAnnouncementApi,
} from '../api/teacher-announcement.api';

import type { Announcement } from '../models/announcement.model';
import type { AnnouncementUpsertFormData } from '../models/announcement-form-data.model';

type Result = {
  loading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  editAnnouncement: (
    id: number,
    data: AnnouncementUpsertFormData,
  ) => Promise<Announcement>;
  deleteAnnouncement: (id: number) => Promise<boolean>;
};

export function useAnnouncementEdit(): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: mutateEditAnnouncement, isLoading } = useMutation(
    editAnnouncementApi({
      onSuccess: (data) =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryAnnouncementKey.list,
          }),
          queryClient.invalidateQueries({
            queryKey: [...queryAnnouncementKey.single, { id: data?.id }],
          }),
        ]),
    }),
  );

  const { mutateAsync: mutateDeleteAnnouncement, isLoading: isDeleteLoading } =
    useMutation(
      deleteAnnouncementApi({
        onSuccess: (_, variables) =>
          Promise.all([
            queryClient.invalidateQueries({
              queryKey: queryAnnouncementKey.list,
            }),
            queryClient.invalidateQueries({
              queryKey: [...queryAnnouncementKey.single, { id: variables }],
            }),
          ]),
      }),
    );

  const editAnnouncement = useCallback(
    async (id: number, data: AnnouncementUpsertFormData) =>
      mutateEditAnnouncement({
        id,
        data,
      }),
    [mutateEditAnnouncement],
  );

  const deleteAnnouncement = useCallback(
    async (id: number) => {
      return mutateDeleteAnnouncement(id);
    },
    [mutateDeleteAnnouncement],
  );

  return {
    loading: isLoading || isDeleteLoading,
    isDone,
    setIsDone,
    editAnnouncement,
    deleteAnnouncement,
  };
}
