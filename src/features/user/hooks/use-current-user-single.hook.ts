import { useQuery } from '@tanstack/react-query';

import { transformToUser } from '../helpers/user-transform.helper';
import { getCurrentUser } from '../api/auth.api';

import type { User } from '../models/user.model';

type Result = {
  loading: boolean;
  user?: User;
};

export function useCurrentUserSingle(): Result {
  const {
    data: user,
    isLoading,
    isFetching,
  } = useQuery(
    getCurrentUser({
      refetchOnWindowFocus: false,
      select: (data: any) => {
        return transformToUser(data);
      },
    }),
  );

  return {
    loading: isLoading || isFetching,
    user: user || undefined,
  };
}
