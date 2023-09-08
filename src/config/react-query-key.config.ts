import {
  createQueryKeys,
  mergeQueryKeys,
} from '@lukemorales/query-key-factory';

const core = createQueryKeys('core', {
  time: null,
});

const users = createQueryKeys('users', {
  user: null,
  createUser: null,
});

export const queryKey = mergeQueryKeys(core, users);
