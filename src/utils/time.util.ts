import dayjs from '#/config/dayjs.config';
import { Duration } from 'dayjs/plugin/duration';

export const DAYS_PER_WEEK = 7;

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

export function generateCountdownDate(value: Duration | null) {
  if (!value) {
    return null;
  }

  const days = value.format('DD');
  const hours = value.format('HH');
  const minutes = value.format('mm');
  const hasSeconds = !!value.seconds();

  const countdown = [];

  if (+days > 0) {
    countdown.push(+days > 1 ? `${days} days` : `${days} day`);
  }

  if (+hours > 0) {
    countdown.push(+hours > 1 ? `${hours} hours` : `${hours} hour`);
  }

  if (+minutes > 0 || hasSeconds) {
    const mins =
      +minutes < 59 && hasSeconds
        ? value.clone().add(1, 'm').format('mm')
        : minutes;
    countdown.push(+mins > 1 ? `${mins} minutes` : `${mins} minute`);
  }

  return countdown.join(' : ');
}

export function generateCountdownTime(value: Duration | null) {
  if (!value) {
    return null;
  }

  const hours = value.format('HH');
  const minutes = value.format('mm');
  const seconds = value.format('ss');

  if (+hours > 0) {
    return `${hours}:${minutes}:${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

export function getDayJsDuration(targetDate?: Date, sourceDate?: Date) {
  const targetDayJs = dayjs(targetDate);
  const sourceDayJs = dayjs(sourceDate);
  const diff = targetDayJs.diff(sourceDayJs);
  return dayjs.duration(Math.max(0, diff) || 0);
}

export function generateTimelineHours(min: number, max: number) {
  if (min >= max) {
    return [];
  }

  const DEFAULT_MIN_HOUR = 7;
  const DEFAULT_MAX_HOUR = 17;

  const minHour = min < DEFAULT_MIN_HOUR ? min : DEFAULT_MIN_HOUR;
  const maxHour = max < DEFAULT_MAX_HOUR ? DEFAULT_MAX_HOUR : max;
  const count = maxHour - minHour + 1;

  return [...Array(count)].map((_, index) => minHour + index);
}
