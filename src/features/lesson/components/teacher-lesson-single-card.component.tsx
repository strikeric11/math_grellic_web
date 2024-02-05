import { memo, useCallback, useMemo } from 'react';
import { Menu } from '@headlessui/react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { convertSecondsToDuration } from '#/utils/time.util';
import { RecordStatus } from '#/core/models/core.model';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';

import type { ComponentProps, MouseEvent } from 'react';
import type { Lesson } from '../models/lesson.model';

type Props = ComponentProps<typeof BaseSurface> & {
  lesson: Lesson;
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

export const TeacherLessonSingleCard = memo(function ({
  className,
  lesson,
  isDashboard,
  onDetails,
  onPreview,
  onEdit,
  onSchedule,
  ...moreProps
}: Props) {
  const [orderNumber, title, duration, isDraft] = useMemo(
    () => [
      lesson.orderNumber,
      lesson.title,
      convertSecondsToDuration(lesson.durationSeconds || 0, true),
      (lesson.status === RecordStatus.Draft) as boolean,
    ],
    [lesson],
  );

  const [scheduleDate, scheduleTime] = useMemo(() => {
    if (!lesson.schedules?.length) {
      return [];
    }

    return [
      dayjs(lesson.schedules[0].startDate).format('MMM DD, YYYY'),
      dayjs(lesson.schedules[0].startDate).format('hh:mm A'),
    ];
  }, [lesson]);

  return (
    <BaseSurface
      className={cx(
        'pointer-events-none flex items-center gap-5 !p-2.5 transition-all hover:cursor-pointer hover:!border-primary-focus hover:shadow-md hover:ring-1 hover:ring-primary-focus',
        isDashboard && 'xs:!pr-5',
        className,
      )}
      rounded='sm'
      {...moreProps}
    >
      <div
        className={cx(
          'group pointer-events-auto flex flex-1 flex-col items-start gap-2.5 xs:flex-row xs:gap-4',
          isDashboard
            ? 'flex-wrap -2lg:flex-nowrap xl:flex-wrap 2xl:flex-nowrap'
            : 'flex-wrap md:flex-nowrap',
        )}
        tabIndex={0}
        onClick={onDetails}
      >
        <div
          className={cx(
            'flex flex-1 flex-col items-start gap-4 xs:flex-row xs:items-center md:w-auto',
            isDashboard
              ? 'w-full -2lg:w-auto xl:w-full 2xl:w-auto'
              : 'w-full md:w-auto',
          )}
        >
          <div className='flex h-[68px] w-full items-center justify-center overflow-hidden rounded border border-primary bg-primary-focus-light/30 text-primary xs:w-[121px]'>
            <BaseIcon name='chalkboard-teacher' size={40} weight='light' />
          </div>
          <div className='flex h-full flex-1 flex-col gap-2'>
            {/* Info chips */}
            <div className='hidden items-center gap-2.5 xs:flex'>
              <BaseChip iconName='chalkboard-teacher'>
                Lesson {orderNumber}
              </BaseChip>
              <BaseDivider className='!h-6' vertical />
              <BaseChip iconName='hourglass'>{duration}</BaseChip>
              {isDraft && (
                <>
                  <BaseDivider className='!h-6' vertical />
                  <BaseChip iconName='file-dashed'>Draft</BaseChip>
                </>
              )}
            </div>
            {/* Title */}
            <h2 className='font-body text-lg font-medium tracking-normal text-accent group-hover:text-primary-focus'>
              {title}
            </h2>
          </div>
        </div>
        {/* Mobile lesson info */}
        <div className='flex w-full items-center justify-between gap-2.5 xs:hidden'>
          <div className='flex flex-col gap-1'>
            <BaseChip iconName='chalkboard-teacher'>
              Lesson {orderNumber}
            </BaseChip>
            <BaseChip iconName='hourglass'>{duration}</BaseChip>
            {isDraft && <BaseChip iconName='file-dashed'>Draft</BaseChip>}
          </div>
          {!isDashboard && (
            <ContextMenu
              isDraft={isDraft}
              onDetails={onDetails}
              onPreview={onPreview}
              onEdit={onEdit}
              onSchedule={onSchedule}
            />
          )}
        </div>
        {/* Earliest lesson schedule */}
        {scheduleDate && (
          <div
            className={cx(
              'flex w-32 pt-1',
              isDashboard
                ? 'w-full flex-col items-start gap-1 -2lg:w-auto -2lg:flex-row -2lg:items-center -2lg:gap-2.5 xl:w-full xl:flex-col xl:items-start xl:gap-1 2xl:w-auto 2xl:flex-row 2xl:items-center 2xl:gap-2.5'
                : 'min-w-0 flex-col items-start gap-1 xs:min-w-[240px] xs:flex-row xs:gap-2.5 sm:min-w-0 sm:flex-col sm:gap-1 md:w-auto md:min-w-[240px] md:flex-row md:items-center md:gap-2.5',
            )}
          >
            <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
            <BaseDivider
              className={cx(
                'hidden !h-6',
                isDashboard ? 'xl:hidden 2xl:block' : 'sm:hidden md:block',
              )}
              vertical
            />
            <BaseChip iconName='clock'>{scheduleTime}</BaseChip>
          </div>
        )}
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

export const TeacherLessonSingleCardSkeleton = memo(function () {
  return (
    <div className='flex w-full animate-pulse flex-col justify-between gap-5 rounded-lg bg-accent/20 py-2.5 pl-2.5 pr-4 xs:flex-row xs:gap-2.5'>
      <div className='flex flex-1 flex-col items-start justify-between gap-4 xs:flex-row xs:items-center md:justify-start'>
        <div className='h-[68px] w-full rounded bg-accent/20 xs:w-[121px]' />
        <div className='flex h-full w-full flex-1 flex-col justify-between gap-2.5'>
          <div className='h-6 w-full rounded bg-accent/20 -3xs:w-[200px] xs:w-full sm:w-[200px]' />
          <div className='h-6 w-28 rounded bg-accent/20' />
        </div>
      </div>
      <div className='flex h-full w-full flex-1 gap-5 -3xs:w-fit md:flex-none'>
        <div className='h-6 w-full rounded bg-accent/20 -3xs:w-[240px] xs:w-full md:w-[240px]' />
        <div className='hidden h-full w-5 rounded bg-accent/20 xs:block' />
      </div>
    </div>
  );
});
