import { memo, useMemo } from 'react';
import { Menu } from '@headlessui/react';
import dayjs from 'dayjs';
import cx from 'classix';

import { convertSecondsToDuration, getDayJsDuration } from '#/utils/time.util';
import { RecordStatus } from '#/core/models/core.model';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseSurface } from '#/base/components/base-surface.component';

import type { ComponentProps } from 'react';
import type { Exam } from '../models/exam.model';

type Props = ComponentProps<typeof BaseSurface> & {
  exam: Exam;
  onDetails?: () => void;
  onPreview?: () => void;
  onEdit?: () => void;
  onSchedule?: () => void;
};

const menuIconProps = { weight: 'bold', size: 48 } as ComponentProps<
  typeof BaseIconButton
>['iconProps'];

export const TeacherExamSingleCard = memo(function ({
  className,
  exam,
  onDetails,
  onPreview,
  onEdit,
  onSchedule,
  ...moreProps
}: Props) {
  const orderNumber = useMemo(() => exam.orderNumber, [exam]);
  const title = useMemo(() => exam.title, [exam]);
  const questionsCount = useMemo(() => exam.visibleQuestionsCount, [exam]);
  const isDraft = useMemo(() => exam.status === RecordStatus.Draft, [exam]);

  const questionsCountText = useMemo(
    () =>
      questionsCount > 1
        ? `${questionsCount} Questions`
        : `${questionsCount} Question`,
    [questionsCount],
  );

  const passingPoints = useMemo(() => exam.passingPoints, [exam]);

  const totalPoints = useMemo(
    () => exam.pointsPerQuestion * exam.visibleQuestionsCount,
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
        'flex h-[106px] w-full items-center gap-5 !p-2.5',
        className,
      )}
      rounded='sm'
      {...moreProps}
    >
      <div className='flex h-full flex-1 items-start gap-4'>
        <div className='flex h-full flex-1 items-start gap-4'>
          <div className='flex h-full w-[121px] flex-col items-center overflow-hidden rounded border border-primary bg-primary-hue-purple/30 font-medium'>
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
          <div className='flex h-full flex-1 flex-col justify-center gap-2'>
            {/* Info chips */}
            <div className='flex items-center gap-2.5'>
              <BaseChip iconName='exam'>Exam {orderNumber}</BaseChip>
              <BaseDivider className='!h-6' vertical />
              <BaseChip iconName='list-numbers'>{questionsCountText}</BaseChip>
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
          {/* Earliest exam schedule */}
          {scheduleDate && (
            <div className='flex flex-col gap-1.5'>
              <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
              <BaseChip iconName='clock'>{scheduleTime}</BaseChip>
              <BaseChip iconName='hourglass'>{scheduleDuration}</BaseChip>
            </div>
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

export const TeacherExamSingleCardSkeleton = memo(function () {
  return (
    <div className='flex min-h-[106px] w-full animate-pulse justify-between rounded-lg bg-accent/20 py-2.5 pl-2.5 pr-4'>
      <div className='flex h-fit flex-1 flex-col gap-3'>
        <div className='h-6 w-[200px] rounded bg-accent/20' />
        <div className='h-6 w-28 rounded bg-accent/20' />
      </div>
      <div className='flex h-full gap-5'>
        <div className='flex flex-col gap-1.5'>
          <div className='h-6 w-48 rounded bg-accent/20' />
          <div className='h-6 w-48 rounded bg-accent/20' />
          <div className='h-6 w-48 rounded bg-accent/20' />
        </div>
        <div className='h-full w-5 rounded bg-accent/20' />
      </div>
    </div>
  );
});
