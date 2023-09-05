import {
  createQueryKeys,
  mergeQueryKeys,
} from '@lukemorales/query-key-factory';

const users = createQueryKeys('users', {
  user: null,
  createUser: null,
});

export const queryKey = mergeQueryKeys(users);
