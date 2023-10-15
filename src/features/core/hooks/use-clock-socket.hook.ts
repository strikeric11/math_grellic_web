import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';

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
    socket?.removeAllListeners('tick');
    socket?.on('tick', setClock);
  }, [socket, setClock]);

  const stopClock = useCallback(() => {
    socket?.removeAllListeners('tick');
  }, [socket]);

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
