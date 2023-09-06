import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

import { BaseControlledDatePicker } from '#/base/components/base-date-picker.component';
import { BaseControlledTimePicker } from '#/base/components/base-time-picker.component';

import type { LessonUpsertFormData } from '#/lesson/models/lesson.model';

const calendarSelectorProps = {
  minDate: new Date(`${new Date().getFullYear() - 5}-01-01`),
  maxDate: new Date(`${new Date().getFullYear() + 5}-12-31`),
};

export const LessonUpsertFormStep2 = memo(function () {
  const { control } = useFormContext<LessonUpsertFormData>();

  return (
    <div>
      <fieldset className='flex flex-wrap gap-5'>
        <div className='flex w-full items-start justify-between gap-5'>
          <BaseControlledDatePicker
            name='startDate'
            label='Start Date'
            control={control}
            iconName='calendar'
            calendarSelectorProps={calendarSelectorProps}
            fullWidth
          />
          <BaseControlledTimePicker
            name='startTime'
            label='Start Time'
            control={control}
            iconName='clock'
            fullWidth
          />
        </div>
      </fieldset>
    </div>
  );
});
