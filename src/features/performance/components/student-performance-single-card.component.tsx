import { memo, useCallback, useMemo } from 'react';
import { Menu } from '@headlessui/react';
import cx from 'classix';

import { generateOrdinalSuffix } from '#/utils/string.util';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { generateFullName } from '#/user/helpers/user.helper';
import { UserAvatarImg } from '#/user/components/user-avatar-img.component';
import { StudentPerformanceType } from '../models/performance.model';
import { PerformanceRankAwardImg } from './performance-rank-award-img.component';

import type { ComponentProps, MouseEvent } from 'react';
import type { StudentPerformance } from '../models/performance.model';

type Props = ComponentProps<typeof BaseSurface> & {
  student: StudentPerformance;
  performance: StudentPerformanceType;
  onDetails?: () => void;
};

type ContextMenuProps = ComponentProps<'div'> & {
  onDetails?: () => void;
};

const menuIconProps = { weight: 'bold', size: 48 } as ComponentProps<
  typeof BaseIconButton
>['iconProps'];

const ContextMenu = memo(function ({
  className,
  onDetails,
  ...moreProps
}: ContextMenuProps) {
  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  }, []);

  return (
    <div
      className={cx('pointer-events-auto relative h-12 w-7', className)}
      {...moreProps}
    >
      <BaseDropdownMenu
        customMenuButton={
          <div className='relative h-12 w-7'>
            <Menu.Button
              as={BaseIconButton}
              name='dots-three-vertical'
              variant='link'
              className='button absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
              iconProps={menuIconProps}
              onClick={handleClick}
            />
          </div>
        }
      >
        <Menu.Item
          as={BaseDropdownButton}
          iconName='article'
          onClick={onDetails}
        >
          Details
        </Menu.Item>
      </BaseDropdownMenu>
    </div>
  );
});

export const StudentPerformanceSingleCard = memo(function ({
  className,
  student,
  performance,
  onDetails,
  ...moreProps
}: Props) {
  const [publicId, email, gender, totalLessonCount] = useMemo(
    () => [
      student.publicId,
      student.email,
      student.gender,
      student.totalLessonCount,
    ],
    [student],
  );

  const overallScore = useMemo(() => {
    if (performance === StudentPerformanceType.Exam) {
      return student.overallExamScore;
    } else if (performance === StudentPerformanceType.Activity) {
      return student.overallActivityScore;
    } else {
      return student.lessonsCompletedCount;
    }
  }, [performance, student]);

  const overallRank = useMemo(() => {
    if (performance === StudentPerformanceType.Exam) {
      return student.overallExamRank;
    } else if (performance === StudentPerformanceType.Activity) {
      return student.overallActivityRank;
    } else {
      return null;
    }
  }, [performance, student]);

  const fullName = useMemo(
    () =>
      generateFullName(student.firstName, student.lastName, student.middleName),
    [student],
  );

  const overallRankText = useMemo(
    () => (overallRank == null ? '-' : generateOrdinalSuffix(overallRank)),
    [overallRank],
  );

  const overallScoreText = useMemo(() => {
    if (performance === StudentPerformanceType.Lesson) {
      return `${overallScore || 0}/${totalLessonCount} Completed`;
    } else {
      if (overallScore == null) {
        return '';
      }

      const pointText = overallScore > 1 ? 'Points' : 'Point';
      return `${overallScore} ${pointText}`;
    }
  }, [overallScore, totalLessonCount, performance]);

  return (
    <BaseSurface
      className={cx(
        'pointer-events-none flex w-full items-center gap-5 !p-2.5 transition-all hover:cursor-pointer hover:shadow-md hover:ring-1',
        performance === StudentPerformanceType.Exam &&
          'hover:!border-primary-hue-purple-focus hover:ring-primary-hue-purple-focus',
        performance === StudentPerformanceType.Activity &&
          'hover:!border-primary-hue-teal-focus hover:ring-primary-hue-teal-focus',
        performance === StudentPerformanceType.Lesson &&
          'hover:!border-primary-focus hover:ring-primary-focus',
        className,
      )}
      rounded='sm'
      {...moreProps}
    >
      <div
        className='group pointer-events-auto flex flex-1 flex-col items-start gap-4 -2lg:flex-row -2lg:items-center'
        tabIndex={0}
        onClick={onDetails}
      >
        <div className='flex w-full flex-1 flex-col items-center gap-4 xs:flex-row'>
          <UserAvatarImg className='shrink-0' gender={gender} />
          <div className='flex w-full items-center justify-between'>
            <div className='flex flex-1 flex-col gap-2'>
              {/* Info chips */}
              <div className='flex flex-col items-start gap-1 xs:flex-row xs:items-center xs:gap-2.5'>
                <BaseChip iconName='identification-badge' className='shrink-0'>
                  {publicId}
                </BaseChip>
                <BaseDivider className='hidden !h-6 xs:block' vertical />
                <BaseChip iconName='at' className='!lowercase'>
                  {email}
                </BaseChip>
              </div>
              {/* Title */}
              <h2
                className={cx(
                  'font-body text-lg font-medium tracking-normal text-accent',
                  performance === StudentPerformanceType.Exam &&
                    'group-hover:text-primary-hue-purple-focus',
                  performance === StudentPerformanceType.Activity &&
                    'group-hover:text-primary-hue-teal-focus',
                  performance === StudentPerformanceType.Lesson &&
                    'group-hover:text-primary-focus',
                )}
              >
                {fullName}
              </h2>
            </div>
            <ContextMenu className='block xs:hidden' onDetails={onDetails} />
          </div>
        </div>
        {/* Ranking + score */}
        <div
          className={cx(
            'flex h-full w-full min-w-[230px] items-center gap-5 font-bold -2lg:w-auto',
            performance === StudentPerformanceType.Exam &&
              '!text-primary-hue-purple',
            performance === StudentPerformanceType.Activity &&
              '!text-primary-hue-teal',
            performance === StudentPerformanceType.Lesson && '!text-primary',
          )}
        >
          {performance !== StudentPerformanceType.Lesson ? (
            <>
              <div className='flex w-1/2 items-center justify-end gap-x-2.5 -2lg:w-auto -2lg:justify-normal'>
                <span className='text-4xl'>{overallRankText}</span>
                {overallRank != null && overallRank <= 10 && (
                  <PerformanceRankAwardImg rank={overallRank} />
                )}
              </div>
              {!!overallScore && (
                <>
                  <BaseDivider className='!h-10' vertical />
                  <span className='font-display text-2xl tracking-tighter'>
                    {overallScoreText}
                  </span>
                </>
              )}
            </>
          ) : (
            <span className='font-display text-xl tracking-tighter'>
              {overallScoreText}
            </span>
          )}
        </div>
      </div>
      <ContextMenu className='hidden xs:block' onDetails={onDetails} />
    </BaseSurface>
  );
});

export const StudentPerformanceSingleCardSkeleton = memo(function () {
  return (
    <div className='flex w-full animate-pulse flex-col items-center justify-between gap-4 rounded-lg bg-accent/20 py-2.5 pl-2.5 pr-4 xs:flex-row'>
      <div className='h-[63px] w-[63px] shrink-0 rounded bg-accent/20' />
      <div className='flex h-full w-full flex-1 flex-col justify-between gap-3 py-2.5'>
        <div className='h-6 w-full rounded bg-accent/20 -3xs:w-[200px]' />
        <div className='h-6 w-28 rounded bg-accent/20' />
      </div>
      <div className='flex h-full w-full justify-center gap-4 xs:justify-normal xs:gap-2.5 sm:w-auto md:gap-5'>
        <div className='flex w-full items-center gap-4 -3xs:w-auto xs:w-full xs:gap-2.5 sm:w-auto md:gap-5'>
          <div className='h-10 w-full rounded bg-accent/20 -3xs:w-24 xs:w-full sm:w-24' />
          <div className='h-10 w-full rounded bg-accent/20 -3xs:w-36 xs:w-full sm:w-36' />
        </div>
        <div className='hidden h-full w-5 rounded bg-accent/20 xs:block' />
      </div>
    </div>
  );
});
