import { useEffect, useMemo } from 'react';

import dayjs from '#/config/dayjs.config';
import { useClockSocket } from './use-clock-socket.hook';

type Result = {
  loading: boolean;
  time: string;
  date: string;
  dayName: string;
};

export function useClock(): Result {
  const { serverClock, stopClock } = useClockSocket();

  const time = useMemo(
    () => dayjs(serverClock).format('hh:mm A'),
    [serverClock],
  );

  const date = useMemo(
    () => dayjs(serverClock).format('MMM DD, YYYY'),
    [serverClock],
  );

  const dayName = useMemo(
    () => dayjs(serverClock).format('dddd'),
    [serverClock],
  );

  useEffect(() => {
    return () => {
      stopClock();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading: !serverClock,
    time,
    date,
    dayName,
  };
}
