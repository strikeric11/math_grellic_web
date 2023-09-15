import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { PAGINATION_TAKE } from '#/utils/api.util';
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
  handleLessonDetails: (slug: string) => void;
  handleLessonPreview: (slug: string) => void;
};

const LESSONS_PATH = `/${teacherBaseRoute}/${teacherRoutes.lesson.to}`;

export const defaultSort = {
  field: 'orderNumber',
  order: 'asc' as QuerySort['order'],
};

export const defaultParamKeys = {
  q: undefined,
  status: undefined,
  sort: `${defaultSort.field},${defaultSort.order}`,
  pagination: { take: PAGINATION_TAKE, skip: 0 },
};

export function useLessonTeacherList(): Result {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState<string | null>(null);
  const [filters, setFilters] = useState<QueryFilterOption[]>([]);
  const [sort, setSort] = useState<QuerySort>(defaultSort);
  const [skip, setSkip] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

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

  const pagination = useMemo(() => ({ take: PAGINATION_TAKE, skip }), [skip]);

  const { data, isLoading, refetch, isSuccess } = useQuery(
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

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    setTotalCount(data[1] as number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

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
    window
      .open(
        `${LESSONS_PATH}/${slug}/${teacherRoutes.lesson.previewTo}`,
        '_blank',
      )
      ?.focus();
  }, []);

  const handleLessonDetails = useCallback(
    (slug: string) => {
      navigate(`${LESSONS_PATH}/${slug}`);
    },
    [navigate],
  );

  const handleLessonUpdate = useCallback(
    (slug: string) => {
      navigate(`${LESSONS_PATH}/${slug}/${teacherRoutes.lesson.editTo}`);
    },
    [navigate],
  );

  return {
    lessons,
    loading: isLoading,
    totalCount,
    pagination,
    setKeyword,
    setFilters,
    setSort,
    refetch,
    nextPage,
    prevPage,
    handleLessonPreview,
    handleLessonDetails,
    handleLessonUpdate,
  };
}
