import { memo, useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import dayjs from 'dayjs';
import cx from 'classix';

import { convertSecondsToDuration, getDayJsDuration } from '#/utils/time.util';
import { BaseControlledDatePicker } from '#/base/components/base-date-picker.component';
import { BaseControlledTimeInput } from '#/base/components/base-time-input.component';
import { StudentUserControlledPicker } from '#/user/components/student-user-picker.component';

import type { ComponentProps } from 'react';
import type { ExamUpsertFormData } from '../models/exam-form-data.model';

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
  const { control, setValue } = useFormContext<ExamUpsertFormData>();

  const startDate = useWatch({ control, name: 'startDate' });
  const endDate = useWatch({ control, name: 'endDate' });
  const startTime = useWatch({ control, name: 'startTime' });
  const endTime = useWatch({ control, name: 'endTime' });

  const [durationText, isDurationValid] = useMemo(() => {
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
  }, [startDate, endDate, startTime, endTime]);

  useEffect(() => {
    setValue('endDate', startDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate]);

  return (
    <div {...moreProps}>
      <div className='mb-4 italic'>
        This section is optional, schedules can be added later.
      </div>
      <fieldset
        className='group/field flex flex-wrap gap-5'
        disabled={disabled}
      >
        <div className='w-full'>
          <BaseControlledDatePicker
            name='startDate'
            label='Date'
            control={control}
            iconName='calendar'
            calendarSelectorProps={calendarSelectorProps}
            fullWidth
          />
        </div>
        <div className='flex w-full items-start justify-between gap-5'>
          <BaseControlledTimeInput
            name='startTime'
            label='Start Time'
            control={control}
            iconName='clock'
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
