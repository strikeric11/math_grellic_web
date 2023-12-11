import { memo, useMemo } from 'react';
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

import type { ComponentProps } from 'react';
import type { StudentPerformance } from '../models/performance.model';

type Props = ComponentProps<typeof BaseSurface> & {
  student: StudentPerformance;
  performance: StudentPerformanceType;
  onDetails?: () => void;
};

const menuIconProps = { weight: 'bold', size: 48 } as ComponentProps<
  typeof BaseIconButton
>['iconProps'];

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
      className={cx('flex w-full items-center gap-5 !p-2.5', className)}
      rounded='sm'
      {...moreProps}
    >
      <div className='flex flex-1 items-center gap-4'>
        <div className='flex flex-1 items-center gap-4'>
          <UserAvatarImg gender={gender} />
          <div className='flex h-full flex-1 flex-col gap-2'>
            {/* Info chips */}
            <div className='flex items-center gap-2.5'>
              <BaseChip iconName='identification-badge'>{publicId}</BaseChip>
              <BaseDivider className='!h-6' vertical />
              <BaseChip iconName='at' className='!lowercase'>
                {email}
              </BaseChip>
            </div>
            {/* Title */}
            <h2 className='font-body text-lg font-medium tracking-normal text-accent'>
              {fullName}
            </h2>
          </div>
        </div>
        {/* Ranking + score */}
        <div
          className={cx(
            'flex h-full min-w-[230px] items-center gap-5 font-bold',
            performance === StudentPerformanceType.Exam &&
              '!text-primary-hue-purple',
            performance === StudentPerformanceType.Activity &&
              '!text-primary-hue-teal',
            performance === StudentPerformanceType.Lesson && '!text-primary',
          )}
        >
          {performance !== StudentPerformanceType.Lesson ? (
            <>
              <div className='flex items-center gap-x-2.5'>
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
      <div className='relative h-12 w-7'>
        <BaseDropdownMenu
          customMenuButton={
            <div className='relative h-12 w-7'>
              <Menu.Button
                as={BaseIconButton}
                name='dots-three-vertical'
                variant='link'
                className='button absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
                iconProps={menuIconProps}
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
    </BaseSurface>
  );
});

export const StudentPerformanceSingleCardSkeleton = memo(function () {
  return (
    <div className='flex w-full animate-pulse items-center justify-between gap-x-4 rounded-lg bg-accent/20 py-2.5 pl-2.5 pr-4'>
      <div className='h-[63px] w-[63px] rounded bg-accent/20' />
      <div className='flex h-full flex-1 flex-col justify-between gap-3 py-2.5'>
        <div className='h-6 w-[200px] rounded bg-accent/20' />
        <div className='h-6 w-28 rounded bg-accent/20' />
      </div>
      <div className='flex h-full gap-5'>
        <div className='flex items-center gap-x-5'>
          <div className='h-10 w-24 rounded bg-accent/20' />
          <div className='h-10 w-36 rounded bg-accent/20' />
        </div>
        <div className='h-full w-5 rounded bg-accent/20' />
      </div>
    </div>
  );
});
