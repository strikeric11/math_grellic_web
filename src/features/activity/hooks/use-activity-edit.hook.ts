import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryActivityKey } from '#/config/react-query-keys.config';
import {
  transformToActivity,
  transformToActivityFormData,
} from '../helpers/activity-transform.helper';
import {
  getActivityBySlugAndCurrentTeacherUser,
  editActivity as editActivityApi,
  deleteActivity as deleteActivityApi,
} from '../api/teacher-activity.api';

import type { Activity } from '../models/activity.model';
import type { ActivityUpsertFormData } from '../models/activity-form-data.model';

type Result = {
  loading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  activityFormData: ActivityUpsertFormData | undefined;
  editActivity: (data: ActivityUpsertFormData) => Promise<Activity>;
  deleteActivity: () => Promise<boolean>;
};

export function useActivityEdit(slug?: string): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: mutateEditActivity, isLoading } = useMutation(
    editActivityApi({
      onSuccess: (data) =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryActivityKey.list,
          }),
          queryClient.invalidateQueries({
            queryKey: [...queryActivityKey.single, { slug: data?.slug }],
          }),
        ]),
    }),
  );

  const { mutateAsync: mutateDeleteActivity, isLoading: isDeleteLoading } =
    useMutation(
      deleteActivityApi({
        onSuccess: () =>
          Promise.all([
            queryClient.invalidateQueries({
              queryKey: queryActivityKey.list,
            }),
            queryClient.invalidateQueries({
              queryKey: [...queryActivityKey.single, { slug }],
            }),
          ]),
      }),
    );

  const {
    data: activity,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
  } = useQuery(
    getActivityBySlugAndCurrentTeacherUser(
      { slug: slug || '' },
      {
        enabled: !!slug,
        refetchOnWindowFocus: false,
        select: (data: any) => transformToActivity(data),
      },
    ),
  );

  const activityFormData = useMemo(
    () => (activity ? transformToActivityFormData(activity) : undefined),
    [activity],
  );

  const editActivity = useCallback(
    async (data: ActivityUpsertFormData) => {
      const updatedActivity = await mutateEditActivity({
        slug: slug || '',
        data,
      });
      return updatedActivity;
    },
    [slug, mutateEditActivity],
  );

  const deleteActivity = useCallback(async () => {
    if (!slug?.trim()) {
      return false;
    }

    return mutateDeleteActivity(slug);
  }, [slug, mutateDeleteActivity]);

  return {
    loading: isLoading || isDeleteLoading || isQueryLoading || isQueryFetching,
    isDone,
    setIsDone,
    activityFormData,
    editActivity,
    deleteActivity,
  };
}
