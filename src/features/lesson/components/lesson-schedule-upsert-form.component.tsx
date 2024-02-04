import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import isTime from 'validator/lib/isTime';
import toast from 'react-hot-toast';
import cx from 'classix';

import { BaseButton } from '#/base/components/base-button.components';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseControlledDatePicker } from '#/base/components/base-date-picker.component';
import { BaseControlledTimeInput } from '#/base/components/base-time-input.component';

import type { FormProps, IconName } from '#/base/models/base.model';
import type { LessonSchedule } from '../models/lesson.model';
import type { LessonScheduleUpsertFormData } from '../models/lesson-form-data.model';

type Props = FormProps<
  'div',
  LessonScheduleUpsertFormData,
  Promise<LessonSchedule | null>
> & {
  lessonId: number;
};

const calendarSelectorProps = {
  minDate: new Date(`${new Date().getFullYear() - 5}-01-01`),
  maxDate: new Date(`${new Date().getFullYear() + 5}-12-31`),
};

const schema = z.object({
  startDate: z
    .date({ required_error: 'Start date is required' })
    .min(
      new Date(`${new Date().getFullYear()}-01-01`),
      'Start date is invalid',
    ),
  startTime: z
    .string({ required_error: 'Start time is required' })
    .refine((value) => isTime(value, { hourFormat: 'hour12' }), {
      message: 'Start time is invalid',
    }),
  studentIds: z
    .array(z.number({ required_error: 'Assign students' }), {
      required_error: 'Assign students',
    })
    .nullable(),
});

const defaultValues: Partial<LessonScheduleUpsertFormData> = {
  startDate: undefined,
  startTime: undefined,
  studentIds: [],
};

export const LessonScheduleUpsertForm = memo(function ({
  className,
  lessonId,
  formData,
  isDone,
  onDone,
  onSubmit,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const {
    formState: { isSubmitting },
    control,
    reset,
    handleSubmit,
  } = useForm<LessonScheduleUpsertFormData>({
    shouldFocusError: false,
    defaultValues: formData || defaultValues,
    resolver: zodResolver(schema),
  });

  const [scheduleButtonLabel, scheduleButtonIconName] = useMemo(
    () => [
      formData ? 'Save Changes' : 'Set Schedule',
      (formData ? 'floppy-disk-back' : 'calendar-check') as IconName,
    ],
    [formData],
  );

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  const submitForm = useCallback(
    async (data: LessonScheduleUpsertFormData) => {
      try {
        await onSubmit({ ...data, lessonId });
        toast.success(
          !formData ? 'Created lesson schedule' : 'Update lesson schedule',
        );
        onDone && onDone(true);
        navigate(-1);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [lessonId, formData, onSubmit, onDone, navigate],
  );

  return (
    <div className={cx('flex w-full items-start', className)} {...moreProps}>
      <form
        className='flex flex-1 flex-col'
        onSubmit={handleSubmit(submitForm)}
      >
        <BaseDivider className='block -2xs:hidden' />
        <div className='order-last pt-2.5 -2xs:order-none -2xs:pt-0'>
          <BaseDivider className='mb-2.5 pt-2.5' />
          <div className='flex w-full flex-col items-center justify-between gap-2.5 -3xs:flex-row -3xs:gap-0'>
            <BaseButton
              variant='link'
              size='sm'
              rightIconName='arrow-counter-clockwise'
              onClick={handleReset}
              disabled={isSubmitting || isDone}
            >
              Reset Fields
            </BaseButton>
            <BaseButton
              className='w-full -3xs:w-auto'
              type='submit'
              rightIconName={scheduleButtonIconName}
              loading={isSubmitting}
              disabled={isDone}
            >
              {scheduleButtonLabel}
            </BaseButton>
          </div>
        </div>
        <div className='mx-auto w-full max-w-[600px] pt-5'>
          <fieldset
            className='group/field flex flex-wrap gap-5'
            disabled={isSubmitting || isDone}
          >
            <div className='flex w-full flex-col items-start justify-between gap-5 -2xs:flex-row'>
              <BaseControlledDatePicker
                name='startDate'
                label='Start Date'
                control={control}
                iconName='calendar'
                calendarSelectorProps={calendarSelectorProps}
                asterisk
                fullWidth
              />
              <BaseControlledTimeInput
                name='startTime'
                label='Start Time'
                control={control}
                iconName='clock'
                asterisk
                fullWidth
              />
            </div>
            {/* <div className='flex w-full items-start gap-5'>
              <StudentUserControlledPicker
                name='studentIds'
                label='Students'
                control={control}
                asterisk
              />
            </div> */}
          </fieldset>
        </div>
      </form>
    </div>
  );
});
