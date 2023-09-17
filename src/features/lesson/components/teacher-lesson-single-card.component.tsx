import { memo, useMemo } from 'react';
import { Menu } from '@headlessui/react';
import dayjs from 'dayjs';
import cx from 'classix';

import { convertSecondsToDuration } from '#/utils/time.util';
import { RecordStatus } from '#/core/models/core.model';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '../models/lesson.model';

type Props = ComponentProps<typeof BaseSurface> & {
  lesson: Lesson;
  onDetails?: () => void;
  onPreview?: () => void;
  onEdit?: () => void;
  onSchedule?: () => void;
};

const menuIconProps = { weight: 'bold', size: 48 } as ComponentProps<
  typeof BaseIconButton
>['iconProps'];

export const TeacherLessonSingleCard = memo(function ({
  className,
  lesson,
  onDetails,
  onPreview,
  onEdit,
  onSchedule,
  ...moreProps
}: Props) {
  const orderNumber = useMemo(() => lesson.orderNumber, [lesson]);
  const title = useMemo(() => lesson.title, [lesson]);
  const duration = useMemo(
    () => convertSecondsToDuration(lesson.durationSeconds || 0, true),
    [lesson],
  );
  const isDraft = useMemo(() => lesson.status === RecordStatus.Draft, [lesson]);

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
      className={cx('flex w-full items-center gap-x-5 !p-2.5', className)}
      rounded='sm'
      {...moreProps}
    >
      <div className='flex flex-1 items-start gap-4'>
        <div className='flex flex-1 items-center gap-4'>
          <div className='flex h-[68px] w-[121px] items-center justify-center overflow-hidden rounded border border-primary bg-primary-focus-light/30 text-primary'>
            <BaseIcon name='chalkboard-teacher' size={40} weight='light' />
          </div>
          <div className='flex h-full flex-1 flex-col gap-y-2'>
            {/* Info chips */}
            <div className='flex items-center gap-2.5'>
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
            <h2 className='font-body text-lg font-medium tracking-normal text-accent'>
              {title}
            </h2>
          </div>
        </div>
        {/* Earliest lesson schedule */}
        {scheduleDate && (
          <div className='flex items-center gap-2.5 pt-1'>
            <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
            <BaseDivider className='!h-6' vertical />
            <BaseChip iconName='clock'>{scheduleTime}</BaseChip>
          </div>
        )}
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
    </BaseSurface>
  );
});

export const TeacherLessonSingleCardSkeleton = memo(function () {
  return (
    <div className='flex w-full animate-pulse justify-between rounded-lg bg-accent/20 py-2.5 pl-2.5 pr-4'>
      <div className='flex w-full items-center gap-4'>
        <div className='h-[68px] w-[121px] rounded bg-accent/20' />
        <div className='flex h-fit flex-1 flex-col gap-y-3'>
          <div className='h-6 w-[200px] rounded bg-accent/20' />
          <div className='h-6 w-28 rounded bg-accent/20' />
        </div>
      </div>
      <div className='flex h-full gap-x-5'>
        <div className='h-6 w-[240px] rounded bg-accent/20' />
        <div className='h-full w-5 rounded bg-accent/20' />
      </div>
    </div>
  );
});
