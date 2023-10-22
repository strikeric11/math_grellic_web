import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryActivityKey } from '#/config/react-query-keys.config';
import { createActivity as createActivityApi } from '../api/teacher-activity.api';

import type { ActivityUpsertFormData } from '../models/activity-form-data.model';
import type { Activity } from '../models/activity.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  createActivity: (data: ActivityUpsertFormData) => Promise<Activity>;
};

export function useActivityCreate(): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: createActivity } = useMutation(
    createActivityApi({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryActivityKey.list,
        });
      },
    }),
  );

  return { isDone, setIsDone, createActivity };
}
