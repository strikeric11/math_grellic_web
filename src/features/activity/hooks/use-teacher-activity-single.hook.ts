import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { transformToActivity } from '../helpers/activity-transform.helper';
import { getActivityBySlugAndCurrentTeacherUser } from '../api/teacher-activity.api';

import type { Activity } from '../models/activity.model';

type Result = {
  title?: string;
  activity?: Activity | null;
};

export function useTeacherActivitySingle(): Result {
  const { slug } = useParams();

  const { data: activity } = useQuery(
    getActivityBySlugAndCurrentTeacherUser(
      { slug: slug || '' },
      {
        enabled: !!slug,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToActivity(data);
        },
      },
    ),
  );

  const title = useMemo(() => activity?.title, [activity]);

  return { title, activity };
}
