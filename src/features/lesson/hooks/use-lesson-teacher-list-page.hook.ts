import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getPaginatedLessonsByCurrentTeacherUser } from '../api/lesson-teacher.api';
import { transformToLesson } from '../helpers/lesson-transform.helper';

import type { QueryObserverBaseResult } from '@tanstack/react-query';
import type { QueryFilterOption } from '#/base/models/base.model';
import type { Lesson } from '../models/lesson.model';

type Result = {
  lessons: Lesson[];
  loading: boolean;
  setKeyword: (keyword: string | null) => void;
  setFilters: (filter: QueryFilterOption[]) => void;
  refetch: QueryObserverBaseResult['refetch'];
};

export function useLessonTeacherListPage(): Result {
  const [keyword, setKeyword] = useState<string | null>(null);
  const [filters, setFilters] = useState<QueryFilterOption[]>([]);

  const status = useMemo(() => {
    if (!filters.length) {
      return undefined;
    }

    return filters
      .filter((f) => f.name === 'status')
      .map((f) => f.value)
      .join(',');
  }, [filters]);

  const { data, isFetching, isLoading, refetch } = useQuery(
    getPaginatedLessonsByCurrentTeacherUser(
      { q: keyword || undefined, status },
      {
        refetchOnWindowFocus: false,
        select: (data: any[]) => {
          const [items, totalCount] = data;
          const transformedItems = items.map((item: unknown) =>
            transformToLesson(item),
          );
          return [transformedItems, +totalCount];
        },
      },
    ),
  );

  const lessons = useMemo(() => {
    const [items] = data || [];
    return (items || []) as Lesson[];
  }, [data]);

  return {
    lessons,
    loading: isFetching || isLoading,
    setKeyword,
    setFilters,
    refetch,
  };
}
