import { useCallback, useEffect, useState } from 'react';

import dayjs from '#/config/dayjs.config';
import { useBoundStore } from './use-store.hook';

type Result = {
  serverClock: Date | undefined;
  startClock: () => void;
  stopClock: () => void;
};

export function useClockSocket(): Result {
  const socket = useBoundStore((state) => state.socket);
  const [serverClock, setServerClock] = useState<Date | undefined>(undefined);

  const setClock = useCallback(
    (value: string) => setServerClock(dayjs(value).toDate()),
    [],
  );

  const startClock = useCallback(() => {
    socket?.off('tick', setClock);
    socket?.on('tick', setClock);
  }, [socket, setClock]);

  const stopClock = useCallback(() => {
    socket?.off('tick', setClock);
  }, [socket, setClock]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket?.emit('clock', {}, setClock);
    startClock();
    return () => {
      stopClock();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return { serverClock, startClock, stopClock };
}
