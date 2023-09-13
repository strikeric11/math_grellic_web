import { memo, useMemo } from 'react';
import dayjs from 'dayjs';
import cx from 'classix';

import { RecordStatus } from '#/core/models/core.model';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '../models/lesson.model';
import { Menu } from '@headlessui/react';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';

type Props = ComponentProps<typeof BaseSurface> & {
  lesson: Lesson;
  onUpdate?: () => void;
  onPreview?: () => void;
};

const menuIconProps = { weight: 'bold', size: 48 } as ComponentProps<
  typeof BaseIconButton
>['iconProps'];

export const LessonTeacherSingleCard = memo(function ({
  className,
  lesson,
  onUpdate,
  onPreview,
  ...moreProps
}: Props) {
  const orderNumber = useMemo(() => lesson.orderNumber, [lesson]);
  const title = useMemo(() => lesson.title, [lesson]);
  const durationSeconds = useMemo(() => lesson.durationSeconds || 0, [lesson]);
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
          <div className='flex h-[68px] w-[121px] items-center justify-center overflow-hidden rounded border border-primary bg-accent/20'>
            <BaseIcon name='chalkboard-teacher' size={40} weight='light' />
          </div>
          <div className='flex h-full flex-1 flex-col gap-y-2'>
            {/* Info chips */}
            <div className='flex items-center gap-2.5'>
              <BaseChip iconName='chalkboard-teacher'>
                Lesson {orderNumber}
              </BaseChip>
              <BaseDivider className='!h-6' vertical />
              <BaseChip iconName='hourglass'>{durationSeconds} mins</BaseChip>
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
            iconName='pencil'
            onClick={onUpdate}
          >
            Edit
          </Menu.Item>
          {/* TODO details */}
          <Menu.Item as={BaseDropdownButton} iconName='article'>
            Details
          </Menu.Item>
          {/* TODO preview */}
          <Menu.Item
            as={BaseDropdownButton}
            iconName='file-text'
            onClick={onPreview}
          >
            Preview
          </Menu.Item>
        </BaseDropdownMenu>
      </div>
    </BaseSurface>
  );
});
