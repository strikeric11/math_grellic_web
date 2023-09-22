import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { socket } from '#/config/socket.config';

type Result = {
  serverClock: Date | undefined;
  stopClock: () => void;
};

export function useClockSocket(): Result {
  const [serverClock, setServerClock] = useState<Date | undefined>(undefined);

  const setClock = useCallback(
    (value: string) => setServerClock(dayjs(value).toDate()),
    [],
  );

  const stopClock = useCallback(() => {
    socket.off('clock', setClock);
    socket.off('tick', setClock);
  }, [setClock]);

  useEffect(() => {
    socket.emit('clock', {}, setClock);
    socket.on('tick', setClock);

    return () => {
      stopClock();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { serverClock, stopClock };
}
