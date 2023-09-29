import { memo, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';
import cx from 'classix';

import { convertSecondsToDuration, getDayJsDuration } from '#/utils/time.util';
import { BaseControlledDatePicker } from '#/base/components/base-date-picker.component';
import { BaseControlledTimeInput } from '#/base/components/base-time-input.component';
import { StudentUserControlledPicker } from '#/user/components/student-user-picker.component';

import type { ComponentProps } from 'react';
import type { ExamUpsertFormData } from '../models/exam.model';

type Props = ComponentProps<'div'> & {
  disabled?: boolean;
};

const calendarSelectorProps = {
  minDate: new Date(`${new Date().getFullYear() - 5}-01-01`),
  maxDate: new Date(`${new Date().getFullYear() + 5}-12-31`),
};

export const ExamUpsertFormStep3 = memo(function ({
  disabled,
  ...moreProps
}: Props) {
  const { control, watch } = useFormContext<ExamUpsertFormData>();

  const watchFields = watch(['startDate', 'endDate', 'startTime', 'endTime']);

  const [durationText, isDurationValid] = useMemo(() => {
    const [startDate, endDate, startTime, endTime] = watchFields;

    const startDateTime = dayjs(
      `${dayjs(startDate).format('YYYY-MM-DD')} ${startTime}`,
      'YYYY-MM-DD hh:mm A',
    );

    const endDateTime = dayjs(
      `${dayjs(endDate).format('YYYY-MM-DD')} ${endTime}`,
      'YYYY-MM-DD hh:mm A',
    );

    const duration = getDayJsDuration(
      endDateTime.toDate(),
      startDateTime.toDate(),
    ).asSeconds();

    if (duration <= 0) {
      return ['Please fill in dates and time properly', false];
    }

    return [convertSecondsToDuration(duration), true];
  }, [watchFields]);

  return (
    <div {...moreProps}>
      <div className='mb-4 italic'>
        This section is optional, schedules can be added later.
      </div>
      <fieldset
        className='group/field flex flex-wrap gap-5'
        disabled={disabled}
      >
        <div className='flex w-full items-start justify-between gap-5'>
          <BaseControlledDatePicker
            name='startDate'
            label='Start Date'
            control={control}
            iconName='calendar'
            calendarSelectorProps={calendarSelectorProps}
            fullWidth
          />
          <BaseControlledTimeInput
            name='startTime'
            label='Start Time'
            control={control}
            iconName='clock'
            fullWidth
          />
        </div>
        <div className='flex w-full items-start justify-between gap-5'>
          <BaseControlledDatePicker
            name='endDate'
            label='End Date'
            control={control}
            iconName='calendar'
            calendarSelectorProps={calendarSelectorProps}
            fullWidth
          />
          <BaseControlledTimeInput
            name='endTime'
            label='End Time'
            control={control}
            iconName='clock'
            fullWidth
          />
        </div>
        <div className='flex w-full items-baseline justify-center gap-x-2 border-y border-accent/20 bg-white px-4 py-2.5'>
          <span>Exam Duration:</span>
          <span
            className={cx(isDurationValid ? 'font-medium' : 'text-sm italic')}
          >
            {durationText}
          </span>
        </div>
        <div className='flex w-full items-start gap-5'>
          <StudentUserControlledPicker
            name='studentIds'
            label='Students'
            control={control}
          />
        </div>
      </fieldset>
    </div>
  );
});
