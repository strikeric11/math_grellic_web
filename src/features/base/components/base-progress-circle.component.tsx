import { memo, useMemo } from 'react';
import cx from 'classix';

import { StudentPerformanceType } from '#/performance/models/performance.model';

import type { ComponentProps } from 'react';

type Size = 'sm' | 'base';

type Props = ComponentProps<'div'> & {
  percent: number | null;
  label?: string;
  size?: Size;
  performance?: StudentPerformanceType;
  bottomLabelPosition?: boolean;
};

type CircleProps = ComponentProps<'circle'> & {
  size: number;
  percent?: number;
};

const STROKE_WIDTH = 12;

const Circle = memo(
  ({ className, percent, size, ...moreProps }: CircleProps) => {
    const r = useMemo(() => size / 2 - STROKE_WIDTH / 2, [size]);

    const strokeDasharray = useMemo(() => 2 * Math.PI * r, [r]);

    const strokeDashoffset = useMemo(
      () => (percent ? ((100 - percent) * strokeDasharray) / 100 : 0),
      [percent, strokeDasharray],
    );

    return (
      <circle
        className={cx(className, percent ? '' : 'opacity-30')}
        r={r}
        cx='50%'
        cy='50%'
        fill='transparent'
        strokeWidth={STROKE_WIDTH}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap='round'
        {...moreProps}
      />
    );
  },
);

export const BaseProgressCircle = memo(function ({
  className,
  percent,
  label,
  performance,
  bottomLabelPosition,
  size = 'base',
  ...moreProps
}: Props) {
  const targetSize = useMemo(() => (size === 'base' ? 104 : 80), [size]);

  const svgSize = useMemo(
    () => ({ width: targetSize, height: targetSize }),
    [targetSize],
  );

  const percentText = useMemo(() => {
    const value = percent || 0;
    return `${Math.floor(value)}%`;
  }, [percent]);

  const circleClassname = useMemo(() => {
    switch (performance) {
      case StudentPerformanceType.Exam:
        return 'stroke-primary-hue-purple';
      case StudentPerformanceType.Activity:
        return 'stroke-primary-hue-teal';
      default:
        return 'stroke-primary';
    }
  }, [performance]);

  const textClassname = useMemo(() => {
    switch (performance) {
      case StudentPerformanceType.Exam:
        return 'text-primary-hue-purple';
      case StudentPerformanceType.Activity:
        return 'text-primary-hue-teal';
      default:
        return 'text-primary';
    }
  }, [performance]);

  return (
    <div
      className={cx(
        'flex items-center',
        bottomLabelPosition && 'flex-col',
        className,
      )}
      {...moreProps}
    >
      <div className='relative z-10'>
        <svg {...svgSize}>
          <g className='origin-center' transform='rotate(-90)'>
            <Circle className={circleClassname} size={targetSize} />
            <Circle
              className={circleClassname}
              percent={percent || undefined}
              size={targetSize}
            />
          </g>
        </svg>
        <span
          className={cx(
            'absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 text-2xl font-bold',
            textClassname,
          )}
        >
          {percentText}
        </span>
      </div>
      {label && (
        <div
          className={cx('flex items-center', bottomLabelPosition && 'flex-col')}
        >
          <div
            className={cx(
              'bg-accent',
              bottomLabelPosition ? 'h-4 w-0.5' : 'h-0.5 w-8',
            )}
          />
          <div className='overflow-hidden rounded-4px border-2 border-accent px-2.5 py-1 text-sm font-medium'>
            {label}
          </div>
        </div>
      )}
    </div>
  );
});
