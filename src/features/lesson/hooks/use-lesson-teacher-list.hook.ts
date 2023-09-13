import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { TAKE } from '#/utils/pagination.util';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { getPaginatedLessonsByCurrentTeacherUser } from '../api/lesson-teacher.api';
import { transformToLesson } from '../helpers/lesson-transform.helper';

import type { QueryObserverBaseResult } from '@tanstack/react-query';
import type {
  QueryFilterOption,
  QueryPagination,
  QuerySort,
} from '#/base/models/base.model';
import type { Lesson } from '../models/lesson.model';

const LESSON_PREVIEW_PATH = `/${teacherBaseRoute}/${teacherRoutes.lesson.to}/${teacherRoutes.lesson.previewTo}`;
const LESSON_UPDATE_PATH = `/${teacherBaseRoute}/${teacherRoutes.lesson.to}`;

type Result = {
  lessons: Lesson[];
  loading: boolean;
  totalCount: number;
  pagination: QueryPagination;
  setKeyword: (keyword: string | null) => void;
  setFilters: (filter: QueryFilterOption[]) => void;
  setSort: (sort: QuerySort) => void;
  refetch: QueryObserverBaseResult['refetch'];
  nextPage: () => void;
  prevPage: () => void;
  handleLessonUpdate: (slug: string) => void;
  handleLessonPreview: (slug: string) => void;
};

export const defaultSort = {
  field: 'orderNumber',
  order: 'asc' as QuerySort['order'],
};

export function useLessonTeacherList(): Result {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState<string | null>(null);
  const [filters, setFilters] = useState<QueryFilterOption[]>([]);
  const [sort, setSort] = useState<QuerySort>(defaultSort);
  const [skip, setSkip] = useState<number>(0);

  const status = useMemo(() => {
    if (!filters.length) {
      return undefined;
    }

    return filters
      .filter((f) => f.name === 'status')
      .map((f) => f.value)
      .join(',');
  }, [filters]);

  const querySort = useMemo(() => `${sort.field},${sort.order}`, [sort]);

  const pagination = useMemo(() => ({ take: TAKE, skip }), [skip]);

  const { data, isFetching, isLoading, refetch } = useQuery(
    getPaginatedLessonsByCurrentTeacherUser(
      { q: keyword || undefined, status, sort: querySort, pagination },
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

  const totalCount = useMemo(() => (data ? data[1] : 0) as number, [data]);

  const nextPage = useCallback(() => {
    const count = skip + pagination.take;

    if (totalCount <= count) {
      return;
    }

    setSkip(count);
  }, [skip, totalCount, pagination]);

  const prevPage = useCallback(() => {
    if (skip <= 0) {
      return;
    }
    setSkip(Math.max(0, skip - pagination.take));
  }, [skip, pagination]);

  const handleLessonPreview = useCallback((slug: string) => {
    window.open(`${LESSON_PREVIEW_PATH}/${slug}`, '_blank')?.focus();
  }, []);

  const handleLessonUpdate = useCallback(
    (slug: string) => {
      navigate(`${LESSON_UPDATE_PATH}/${slug}/edit`);
    },
    [navigate],
  );

  return {
    lessons,
    loading: isFetching || isLoading,
    totalCount,
    pagination,
    setKeyword,
    setFilters,
    setSort,
    refetch,
    nextPage,
    prevPage,
    handleLessonPreview,
    handleLessonUpdate,
  };
}
