import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { getDateTimeNow } from '#/core/api/core.api';

type Result = {
  loading: boolean;
  time: string;
  date: string;
  dayName: string;
};

const INTERVAL_MS = 10000;
const REFRESH_INTERVAL_MS = 600000; // Refresh 10 mins

export function useClock(): Result {
  const { refetch: fetchServerTime } = useQuery(
    getDateTimeNow({
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: false,
      retry: false,
      retryOnMount: false,
      select: (data: unknown) => dayjs(data as string).toDate(),
    }),
  );

  const lastServerTime = useRef<Date | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);

  const time = useMemo(
    () => dayjs(currentDateTime).format('hh:mm A'),
    [currentDateTime],
  );

  const date = useMemo(
    () => dayjs(currentDateTime).format('MMM DD, YYYY'),
    [currentDateTime],
  );

  const dayName = useMemo(
    () => dayjs(currentDateTime).format('dddd'),
    [currentDateTime],
  );

  useEffect(() => {
    const refreshTime = async () => {
      try {
        const { data: serverTime } = await fetchServerTime();
        setCurrentDateTime(serverTime || null);
        lastServerTime.current = serverTime || null;
      } catch (error) {
        // TODO toast
      }
    };
    // Initialize current time
    (async () => await refreshTime())();
    // Setup interval for updating
    const updateClock = () => {
      const currentTimeMs = Date.now();

      if (
        currentTimeMs - (lastServerTime.current?.getTime() || 0) >=
        REFRESH_INTERVAL_MS
      ) {
        refreshTime();
      } else {
        setCurrentDateTime((prev) =>
          dayjs(prev).add(INTERVAL_MS, 'milliseconds').toDate(),
        );
      }
    };
    const interval = setInterval(updateClock, INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading: !currentDateTime,
    time,
    date,
    dayName,
  };
}
