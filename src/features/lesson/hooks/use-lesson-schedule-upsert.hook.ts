import { useState } from 'react';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
};

export function useLessonScheduleUpsert(): Result {
  const [isDone, setIsDone] = useState(false);

  return { isDone, setIsDone };
}
