import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { PAGINATION_TAKE } from '#/utils/api.util';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { transformToMeetingSchedule } from '../helpers/schedule-transform.helper';
import { getPaginatedMeetingSchedulesByCurrentTeacherUser } from '../api/teacher-schedule.api';

import type { QueryPagination, QuerySort } from '#/base/models/base.model';
import type { MeetingSchedule } from '../models/schedule.model';

type Result = {
  meetingSchedules: MeetingSchedule[];
  loading: boolean;
  totalCount: number;
  pagination: QueryPagination;
  setKeyword: (keyword: string | null) => void;
  setSort: (sort: QuerySort) => void;
  refresh: () => void;
  nextPage: () => void;
  prevPage: () => void;
  handleMeetingScheduleEdit: (id: number) => void;
  handleMeetingScheduleDetails: (id: number) => void;
};

const MEETING_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.schedule.to}/${teacherRoutes.schedule.meeting.to}`;

export const defaultSort = {
  field: 'scheduleDate',
  order: 'desc' as QuerySort['order'],
};

export const defaultParamKeys = {
  q: undefined,
  sort: `${defaultSort.field},${defaultSort.order}`,
  pagination: { take: PAGINATION_TAKE, skip: 0 },
};

export function useTeacherMeetingScheduleList(): Result {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState<string | null>(null);
  const [sort, setSort] = useState<QuerySort>(defaultSort);
  const [skip, setSkip] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  const querySort = useMemo(() => `${sort.field},${sort.order}`, [sort]);

  const pagination = useMemo(() => ({ take: PAGINATION_TAKE, skip }), [skip]);

  const { data, isLoading, isRefetching, refetch } = useQuery(
    getPaginatedMeetingSchedulesByCurrentTeacherUser(
      { q: keyword || undefined, sort: querySort, pagination },
      {
        refetchOnWindowFocus: false,
        select: (data: any[]) => {
          const [items, totalCount] = data;
          const transformedItems = items.map((item: unknown) =>
            transformToMeetingSchedule(item),
          );

          return [transformedItems, +totalCount];
        },
      },
    ),
  );

  const meetingSchedules = useMemo(() => {
    const [items] = data || [];
    return (items || []) as MeetingSchedule[];
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

  const handleMeetingScheduleDetails = useCallback(
    (id: number) => {
      navigate(`${MEETING_LIST_PATH}/${id}`);
    },
    [navigate],
  );

  const handleMeetingScheduleEdit = useCallback(
    (id: number) => {
      navigate(
        `${MEETING_LIST_PATH}/${id}/${teacherRoutes.schedule.meeting.editTo}`,
      );
    },
    [navigate],
  );

  const refresh = useCallback(() => {
    setSkip(0);
    refetch();
  }, [refetch]);

  return {
    meetingSchedules,
    loading: isLoading || isRefetching,
    totalCount,
    pagination,
    setKeyword,
    setSort,
    refresh,
    nextPage,
    prevPage,
    handleMeetingScheduleEdit,
    handleMeetingScheduleDetails,
  };
}
