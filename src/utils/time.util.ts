import dayjs from 'dayjs';

export function convertDurationToSeconds(duration: string): number {
  const [s = 0, m = 0, h = 0] = duration.split(':').reverse();
  return +h * 3600 + +m * 60 + +s;
}

export function convertSecondsToDuration(
  seconds: number,
  isCompact?: boolean,
): string {
  const duration = dayjs.duration(seconds, 'seconds');

  if (isCompact && !duration.hours()) {
    return duration.format('mm:ss');
  } else {
    return duration.format('HH:mm:ss');
  }
}
