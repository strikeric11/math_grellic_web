import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { PAGINATION_TAKE } from '#/utils/api.util';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { getPaginatedExamsByCurrentTeacherUser } from '../api/teacher-exam.api';
import { transformToExam } from '../helpers/exam-transform.helper';

import type {
  QueryFilterOption,
  QueryPagination,
  QuerySort,
} from '#/base/models/base.model';
import type { Exam } from '../models/exam.model';

type Result = {
  exams: Exam[];
  loading: boolean;
  totalCount: number;
  pagination: QueryPagination;
  setKeyword: (keyword: string | null) => void;
  setFilters: (filter: QueryFilterOption[]) => void;
  setSort: (sort: QuerySort) => void;
  refresh: () => void;
  nextPage: () => void;
  prevPage: () => void;
  handleExamEdit: (slug: string) => void;
  handleExamDetails: (slug: string) => void;
  handleExamPreview: (slug: string) => void;
  handleExamSchedule: (slug: string) => void;
};

const EXAM_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.exam.to}`;

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

export function useTeacherExamList(): Result {
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
    getPaginatedExamsByCurrentTeacherUser(
      { q: keyword || undefined, status, sort: querySort, pagination },
      {
        refetchOnWindowFocus: false,
        select: (data: any[]) => {
          const [items, totalCount] = data;
          const transformedItems = items.map((item: unknown) =>
            transformToExam(item),
          );

          return [transformedItems, +totalCount];
        },
      },
    ),
  );

  const exams = useMemo(() => {
    const [items] = data || [];
    return (items || []) as Exam[];
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

  const handleExamPreview = useCallback((slug: string) => {
    window
      .open(
        `${EXAM_LIST_PATH}/${slug}/${teacherRoutes.exam.previewTo}`,
        '_blank',
      )
      ?.focus();
  }, []);

  const handleExamDetails = useCallback(
    (slug: string) => {
      navigate(`${EXAM_LIST_PATH}/${slug}`);
    },
    [navigate],
  );

  const handleExamEdit = useCallback(
    (slug: string) => {
      navigate(`${EXAM_LIST_PATH}/${slug}/${teacherRoutes.exam.editTo}`);
    },
    [navigate],
  );

  const handleExamSchedule = useCallback(
    (slug: string) => {
      navigate(`${EXAM_LIST_PATH}/${slug}/${teacherRoutes.exam.schedule.to}`);
    },
    [navigate],
  );

  const refresh = useCallback(() => {
    setSkip(0);
    refetch();
  }, [refetch]);

  return {
    exams,
    loading: isLoading || isRefetching,
    totalCount,
    pagination,
    setKeyword,
    setFilters,
    setSort,
    refresh,
    nextPage,
    prevPage,
    handleExamPreview,
    handleExamDetails,
    handleExamEdit,
    handleExamSchedule,
  };
}
