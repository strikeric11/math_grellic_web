import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { PAGINATION_TAKE } from '#/utils/api.util';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { getPaginatedStudentPerformancesByCurrentTeacherUser } from '../api/teacher-performance.api';
import { transformToStudentPerformance } from '../helpers/performance-transform.helper';
import { StudentPerformanceType } from '../models/performance.model';

import type {
  QueryPagination,
  QueryFilterOption,
  QuerySort,
} from '#/base/models/base.model';
import type { StudentPerformance } from '../models/performance.model';

type Result = {
  students: StudentPerformance[];
  loading: boolean;
  totalCount: number;
  pagination: QueryPagination;
  performance: StudentPerformanceType;
  setKeyword: (keyword: string | null) => void;
  setFilters: (filter: QueryFilterOption[]) => void;
  setSort: (sort: QuerySort) => void;
  refresh: () => void;
  nextPage: () => void;
  prevPage: () => void;
  handlePerformanceDetails: (publicId: string) => void;
};

const PERFORMANCE_PATH = `/${teacherBaseRoute}/${teacherRoutes.performance.to}`;

export const defaultSort = {
  field: 'rank',
  order: 'asc' as QuerySort['order'],
};

export const defaultParamKeys = {
  q: undefined,
  performance: StudentPerformanceType.Exam,
  sort: `${defaultSort.field},${defaultSort.order}`,
  pagination: { take: PAGINATION_TAKE, skip: 0 },
};

export function useStudentPerformanceList(): Result {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState<string | null>(null);
  const [filters, setFilters] = useState<QueryFilterOption[]>([]);
  const [sort, setSort] = useState<QuerySort>(defaultSort);
  const [skip, setSkip] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    setSkip(0);
  }, [keyword, filters, sort]);

  const performance = useMemo(() => {
    if (!filters.length) {
      return defaultParamKeys.performance as StudentPerformanceType;
    }

    const target = filters
      .filter((f) => f.name === 'performance')
      .map((f) => f.value)
      .join(',');

    return target as StudentPerformanceType;
  }, [filters]);

  const querySort = useMemo(() => `${sort.field},${sort.order}`, [sort]);

  const pagination = useMemo(() => ({ take: PAGINATION_TAKE, skip }), [skip]);

  const { data, isLoading, isRefetching, refetch } = useQuery(
    getPaginatedStudentPerformancesByCurrentTeacherUser(
      {
        q: keyword || undefined,
        performance,
        sort: querySort,
        pagination,
      },
      {
        refetchOnWindowFocus: false,
        select: (data: any[]) => {
          const [items, totalCount] = data;
          const transformedItems =
            items?.map((item: unknown) =>
              transformToStudentPerformance(item),
            ) || [];

          return [transformedItems, +totalCount];
        },
      },
    ),
  );

  const students = useMemo(() => {
    const [items] = data || [];
    return (items || []) as StudentPerformance[];
  }, [data]);

  const dataCount = useMemo(
    () => (data ? data[1] : undefined) as number,
    [data],
  );

  useEffect(() => {
    if (!dataCount) {
      return;
    }
    setTotalCount(dataCount);
  }, [dataCount]);

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

  const handlePerformanceDetails = useCallback(
    (publicId: string) => {
      navigate(`${PERFORMANCE_PATH}/${publicId.toLowerCase()}`);
    },
    [navigate],
  );

  const refresh = useCallback(() => {
    setSkip(0);
    refetch();
  }, [refetch]);

  return {
    students,
    loading: isLoading || isRefetching,
    totalCount,
    pagination,
    performance,
    setKeyword,
    setFilters,
    setSort,
    refresh,
    nextPage,
    prevPage,
    handlePerformanceDetails,
  };
}
