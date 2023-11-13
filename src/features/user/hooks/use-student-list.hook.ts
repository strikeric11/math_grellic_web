import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { PAGINATION_TAKE } from '#/utils/api.util';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { transformToStudentUserAccount } from '../helpers/user-transform.helper';
import { getPaginatedStudentsByCurrentTeacherUser } from '../api/user.api';

import type {
  QueryFilterOption,
  QueryPagination,
  QuerySort,
} from '#/base/models/base.model';
import type { StudentUserAccount } from '../models/user.model';

type Result = {
  students: StudentUserAccount[];
  loading: boolean;
  totalCount: number;
  pagination: QueryPagination;
  setKeyword: (keyword: string | null) => void;
  setFilters: (filter: QueryFilterOption[]) => void;
  setSort: (sort: QuerySort) => void;
  refresh: () => void;
  nextPage: () => void;
  prevPage: () => void;
  handleStudentEdit: (publicId: string) => void;
  handleStudentDetails: (publicId: string) => void;
};

const STUDENT_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.student.to}`;

export const defaultSort = {
  field: 'name',
  order: 'asc' as QuerySort['order'],
};

export const defaultParamKeys = {
  q: undefined,
  status: undefined,
  sort: `${defaultSort.field},${defaultSort.order}`,
  pagination: { take: PAGINATION_TAKE, skip: 0 },
};

export function useStudentList(): Result {
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
    getPaginatedStudentsByCurrentTeacherUser(
      { q: keyword || undefined, status, sort: querySort, pagination },
      {
        refetchOnWindowFocus: false,
        select: (data: any[]) => {
          const [items, totalCount] = data;
          const transformedItems = items.map((item: unknown) =>
            transformToStudentUserAccount(item),
          );

          return [transformedItems, +totalCount];
        },
      },
    ),
  );

  const students = useMemo(() => {
    const [items] = data || [];
    return (items || []) as StudentUserAccount[];
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

  const handleStudentDetails = useCallback(
    (publicId: string) => {
      navigate(`${STUDENT_LIST_PATH}/${publicId.toLowerCase()}`);
    },
    [navigate],
  );

  const handleStudentEdit = useCallback(
    (publicId: string) => {
      navigate(
        `${STUDENT_LIST_PATH}/${publicId.toLowerCase()}/${
          teacherRoutes.student.editTo
        }`,
      );
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
    setKeyword,
    setFilters,
    setSort,
    refresh,
    nextPage,
    prevPage,
    handleStudentDetails,
    handleStudentEdit,
  };
}
