import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

import { BaseControlledDatePicker } from '#/base/components/base-date-picker.component';
import { BaseControlledTimeInput } from '#/base/components/base-time-input.component';

import type { ComponentProps } from 'react';
import type { LessonUpsertFormData } from '../models/lesson-form-data.model';

type Props = ComponentProps<'div'> & {
  disabled?: boolean;
};

const calendarSelectorProps = {
  minDate: new Date(`${new Date().getFullYear() - 5}-01-01`),
  maxDate: new Date(`${new Date().getFullYear() + 5}-12-31`),
};

export const LessonUpsertFormStep2 = memo(function ({
  disabled,
  ...moreProps
}: Props) {
  const { control } = useFormContext<LessonUpsertFormData>();

  return (
    <div {...moreProps}>
      <div className='mb-4 italic'>
        This section is optional, schedules can be added later.
      </div>
      <fieldset
        className='group/field flex flex-wrap gap-5'
        disabled={disabled}
      >
        <div className='flex w-full flex-col items-start justify-between gap-5 -2xs:flex-row'>
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
        {/* <div className='flex w-full items-start gap-5'>
          <StudentUserControlledPicker
            name='studentIds'
            label='Students'
            control={control}
          />
        </div> */}
      </fieldset>
    </div>
  );
});
