import {
  createQueryKeys,
  mergeQueryKeys,
} from '@lukemorales/query-key-factory';

const core = createQueryKeys('core', {
  time: null,
});

const user = createQueryKeys('users', {
  currentUser: null,
  createUser: null,
});

const lesson = createQueryKeys('lessons', {
  list: null,
  createLesson: null,
});

export const queryKey = mergeQueryKeys(core, user, lesson);
