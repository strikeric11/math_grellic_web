import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { PAGINATION_TAKE } from '#/utils/api.util';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { transformToActivity } from '../helpers/activity-transform.helper';
import { getPaginatedActivitiesByCurrentTeacherUser } from '../api/teacher-activity.api';

import type {
  QueryFilterOption,
  QueryPagination,
  QuerySort,
} from '#/base/models/base.model';
import type { Activity } from '../models/activity.model';

type Result = {
  activities: Activity[];
  loading: boolean;
  totalCount: number;
  pagination: QueryPagination;
  setKeyword: (keyword: string | null) => void;
  setFilters: (filter: QueryFilterOption[]) => void;
  setSort: (sort: QuerySort) => void;
  refresh: () => void;
  nextPage: () => void;
  prevPage: () => void;
  handleActivityEdit: (slug: string) => void;
  handleActivityDetails: (slug: string) => void;
  handleActivityPreview: (slug: string) => void;
};

const ACTIVITY_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.activity.to}`;

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

export function useTeacherActivityList(): Result {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState<string | null>(null);
  const [filters, setFilters] = useState<QueryFilterOption[]>([]);
  const [sort, setSort] = useState<QuerySort>(defaultSort);
  const [skip, setSkip] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    setSkip(0);
  }, [keyword, filters, sort]);

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

  const { data, isLoading, isRefetching, refetch } = useQuery(
    getPaginatedActivitiesByCurrentTeacherUser(
      { q: keyword || undefined, status, sort: querySort, pagination },
      {
        refetchOnWindowFocus: false,
        select: (data: any[]) => {
          const [items, totalCount] = data;
          const transformedItems = items.map((item: unknown) =>
            transformToActivity(item),
          );

          return [transformedItems, +totalCount];
        },
      },
    ),
  );

  const activities = useMemo(() => {
    const [items] = data || [];
    return (items || []) as Activity[];
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

  const handleActivityPreview = useCallback((slug: string) => {
    window
      .open(
        `${ACTIVITY_LIST_PATH}/${slug}/${teacherRoutes.activity.previewTo}`,
        '_blank',
      )
      ?.focus();
  }, []);

  const handleActivityDetails = useCallback(
    (slug: string) => {
      navigate(`${ACTIVITY_LIST_PATH}/${slug}`);
    },
    [navigate],
  );

  const handleActivityEdit = useCallback(
    (slug: string) => {
      navigate(
        `${ACTIVITY_LIST_PATH}/${slug}/${teacherRoutes.activity.editTo}`,
      );
    },
    [navigate],
  );

  const refresh = useCallback(() => {
    setSkip(0);
    refetch();
  }, [refetch]);

  return {
    activities,
    loading: isLoading || isRefetching,
    totalCount,
    pagination,
    setKeyword,
    setFilters,
    setSort,
    refresh,
    nextPage,
    prevPage,
    handleActivityPreview,
    handleActivityDetails,
    handleActivityEdit,
  };
}
