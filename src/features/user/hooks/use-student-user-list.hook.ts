import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryUserKey } from '#/config/react-query-keys.config';
import { PAGINATION_TAKE } from '#/utils/api.util';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { transformToStudentUserAccount } from '../helpers/user-transform.helper';
import {
  getPaginatedStudentsByCurrentTeacherUser,
  setStudentApprovalStatus as setStudentApprovalStatusApi,
  deleteStudent as deleteStudentApi,
} from '../api/teacher-user.api';

import type {
  QueryFilterOption,
  QueryPagination,
  QuerySort,
} from '#/base/models/base.model';
import type {
  StudentUserAccount,
  UserApprovalStatus,
} from '../models/user.model';

type Result = {
  students: StudentUserAccount[];
  loading: boolean;
  isMutateLoading: boolean;
  totalCount: number;
  pagination: QueryPagination;
  setKeyword: (keyword: string | null) => void;
  setFilters: (filter: QueryFilterOption[]) => void;
  setSort: (sort: QuerySort) => void;
  refresh: () => void;
  nextPage: () => void;
  prevPage: () => void;
  handleStudentEdit: (id: number) => void;
  handleStudentDetails: (id: number) => void;
  setStudentApprovalStatus: (
    id: number,
    approvalStatus: UserApprovalStatus,
  ) => Promise<any>;
  deleteStudent: (id: number) => Promise<boolean | undefined>;
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

export function useStudentUserList(): Result {
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

  const {
    mutateAsync: mutateSetStudentApprovalStatus,
    isLoading: isStatusLoading,
  } = useMutation(setStudentApprovalStatusApi());

  const { mutateAsync: mutateDeleteStudent, isLoading: isDeleteLoading } =
    useMutation(deleteStudentApi());

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

  const refresh = useCallback(() => {
    setSkip(0);
    refetch();
  }, [refetch]);

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
    (id: number) => {
      navigate(`${STUDENT_LIST_PATH}/${id}`);
    },
    [navigate],
  );

  const handleStudentEdit = useCallback(
    (id: number) => {
      navigate(`${STUDENT_LIST_PATH}/${id}/${teacherRoutes.student.editTo}`);
    },
    [navigate],
  );

  const setStudentApprovalStatus = useCallback(
    async (id: number, approvalStatus: UserApprovalStatus) => {
      const result = await mutateSetStudentApprovalStatus({
        studentId: id,
        approvalStatus,
      });

      queryClient.invalidateQueries({
        queryKey: queryUserKey.studentList,
      });

      queryClient.invalidateQueries({
        queryKey: [...queryUserKey.studentSingle, { id }],
      });

      return result;
    },
    [mutateSetStudentApprovalStatus],
  );

  const deleteStudent = useCallback(
    async (id: number) => {
      const result = await mutateDeleteStudent(id);

      queryClient.invalidateQueries({
        queryKey: queryUserKey.studentList,
      });

      queryClient.invalidateQueries({
        queryKey: [...queryUserKey.studentSingle, { id }],
      });

      return result;
    },
    [mutateDeleteStudent],
  );

  return {
    students,
    loading: isLoading || isRefetching,
    isMutateLoading: isStatusLoading || isDeleteLoading,
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
    setStudentApprovalStatus,
    deleteStudent,
  };
}
