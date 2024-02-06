import { memo, useCallback, useMemo } from 'react';
import { Menu } from '@headlessui/react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { convertSecondsToDuration, getDayJsDuration } from '#/utils/time.util';
import { RecordStatus } from '#/core/models/core.model';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseSurface } from '#/base/components/base-surface.component';

import type { ComponentProps, MouseEvent } from 'react';
import type { Exam } from '../models/exam.model';

type Props = ComponentProps<typeof BaseSurface> & {
  exam: Exam;
  isDashboard?: boolean;
  onDetails?: () => void;
  onPreview?: () => void;
  onEdit?: () => void;
  onSchedule?: () => void;
};

type ContextMenuProps = ComponentProps<'div'> & {
  isDraft?: boolean;
  onDetails?: () => void;
  onPreview?: () => void;
  onEdit?: () => void;
  onSchedule?: () => void;
};

const menuIconProps = { weight: 'bold', size: 48 } as ComponentProps<
  typeof BaseIconButton
>['iconProps'];

const ContextMenu = memo(function ({
  className,
  isDraft,
  onDetails,
  onPreview,
  onEdit,
  onSchedule,
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
        <Menu.Item
          as={BaseDropdownButton}
          iconName='file-text'
          onClick={onPreview}
        >
          Preview
        </Menu.Item>
        <BaseDivider className='my-1' />
        <Menu.Item as={BaseDropdownButton} iconName='pencil' onClick={onEdit}>
          Edit
        </Menu.Item>
        {!isDraft && (
          <>
            <BaseDivider className='my-1' />
            <Menu.Item
              as={BaseDropdownButton}
              iconName='calendar'
              onClick={onSchedule}
            >
              Set Schedule
            </Menu.Item>
          </>
        )}
      </BaseDropdownMenu>
    </div>
  );
});

export const TeacherExamSingleCard = memo(function ({
  className,
  exam,
  isDashboard,
  onDetails,
  onPreview,
  onEdit,
  onSchedule,
  ...moreProps
}: Props) {
  const [
    orderNumber,
    title,
    passingPoints,
    totalPoints,
    randomizeQuestions,
    isDraft,
  ] = useMemo(
    () => [
      exam.orderNumber,
      exam.title,
      exam.passingPoints,
      exam.pointsPerQuestion * exam.visibleQuestionsCount,
      exam.randomizeQuestions,
      exam.status === RecordStatus.Draft,
    ],
    [exam],
  );

  const [scheduleDate, scheduleTime, scheduleDuration] = useMemo(() => {
    if (!exam.schedules?.length) {
      return [];
    }

    const { startDate, endDate } = exam.schedules[0];

    // TODO change
    if (!dayjs(startDate).isSame(endDate, 'day')) {
      return [];
    }

    const date = dayjs(startDate).format('MMM DD, YYYY');
    const time = `${dayjs(startDate).format('hh:mm A')} — ${dayjs(
      endDate,
    ).format('hh:mm A')}`;
    const duration = getDayJsDuration(endDate, startDate).asSeconds();

    return [date, time, convertSecondsToDuration(duration)];
  }, [exam]);

  return (
    <BaseSurface
      className={cx(
        'pointer-events-none flex h-auto w-full items-center gap-5 !p-2.5 transition-all hover:cursor-pointer hover:!border-primary-hue-purple-focus hover:shadow-md hover:ring-1 hover:ring-primary-hue-purple-focus sm:h-[106px]',
        className,
      )}
      rounded='sm'
      {...moreProps}
    >
      <div
        className='group pointer-events-auto flex flex-1 items-start gap-4'
        tabIndex={0}
        onClick={onDetails}
      >
        <div className='flex h-full flex-1 flex-col flex-wrap items-center gap-2.5 xs:flex-row xs:gap-4 sm:flex-nowrap'>
          <div className='flex h-[84px] w-full flex-col items-center overflow-hidden rounded border border-primary bg-primary-hue-purple/30 font-medium xs:w-[121px]'>
            <div className='flex w-full flex-1 items-center justify-center text-2xl text-primary-hue-purple'>
              <div className='flex-1 text-center'>{passingPoints}</div>
              <BaseDivider
                className='h-4/6 !border-r-2 !border-primary-hue-purple/20'
                vertical
              />
              <div className='flex-1 text-center'>{totalPoints}</div>
            </div>
            <div className='bg-primary-hue-primary flex w-full justify-center bg-primary-hue-purple py-1 text-xs uppercase text-white'>
              Passing / Total
            </div>
          </div>
          <div className='flex h-full w-full flex-1 flex-row items-center justify-between xs:w-auto'>
            <div className='flex h-full flex-1 flex-col justify-between gap-2 py-2'>
              {/* Info chips */}
              <div className='flex items-center gap-2.5'>
                <BaseChip iconName='exam'>Exam {orderNumber}</BaseChip>
                {randomizeQuestions && (
                  <>
                    <BaseDivider className='!h-6' vertical />
                    <BaseChip iconName='check-square'>Randomized</BaseChip>
                  </>
                )}
                {isDraft && (
                  <>
                    <BaseDivider className='!h-6' vertical />
                    <BaseChip iconName='file-dashed'>Draft</BaseChip>
                  </>
                )}
              </div>
              {/* Title */}
              <h2 className='font-body text-lg font-medium leading-tight tracking-normal text-accent group-hover:text-primary-hue-purple-focus'>
                {title}
              </h2>
            </div>
            {!isDashboard && (
              <ContextMenu
                className='block xs:hidden'
                isDraft={isDraft}
                onDetails={onDetails}
                onPreview={onPreview}
                onEdit={onEdit}
                onSchedule={onSchedule}
              />
            )}
          </div>
          {/* Earliest exam schedule */}
          {scheduleDate && (
            <div className='flex w-full flex-col gap-1 xs:flex-row xs:gap-2.5 sm:w-auto sm:min-w-[190px] sm:flex-col sm:gap-1'>
              <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
              <BaseDivider
                className='hidden !h-6 xs:block sm:hidden'
                vertical
              />
              <BaseChip iconName='clock'>{scheduleTime}</BaseChip>
              <BaseDivider
                className='hidden !h-6 xs:block sm:hidden'
                vertical
              />
              <BaseChip iconName='hourglass'>{scheduleDuration}</BaseChip>
            </div>
          )}
        </div>
      </div>
      {!isDashboard && (
        <ContextMenu
          className='hidden xs:block'
          isDraft={isDraft}
          onDetails={onDetails}
          onPreview={onPreview}
          onEdit={onEdit}
          onSchedule={onSchedule}
        />
      )}
    </BaseSurface>
  );
});

export const TeacherExamSingleCardSkeleton = memo(function () {
  return (
    <div className='flex min-h-[106px] w-full animate-pulse flex-col justify-between gap-2.5 rounded-lg bg-accent/20 py-2.5 pl-2.5 pr-4 xs:flex-row'>
      <div className='h-[84px] w-full shrink-0 rounded bg-accent/20 xs:h-full xs:w-[120px]' />
      <div className='flex h-full w-full flex-1 flex-col justify-between gap-3 py-2.5'>
        <div className='h-6 w-full rounded bg-accent/20 -3xs:w-[200px] xs:w-auto md:w-[200px]' />
        <div className='h-6 w-28 rounded bg-accent/20' />
      </div>
      <div className='flex h-full w-full flex-1 gap-5 sm:w-auto sm:flex-none'>
        <div className='flex w-full flex-col gap-1.5 sm:w-auto'>
          <div className='h-6 w-full rounded bg-accent/20 -3xs:w-48 xs:w-full sm:w-48' />
          <div className='h-6 w-full rounded bg-accent/20 -3xs:w-48 xs:w-full sm:w-48' />
          <div className='h-6 w-full rounded bg-accent/20 -3xs:w-48 xs:w-full sm:w-48' />
        </div>
        <div className='hidden h-full w-5 rounded bg-accent/20 xs:block' />
      </div>
    </div>
  );
});
