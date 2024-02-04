import { memo, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import isTime from 'validator/lib/isTime';
import { Menu } from '@headlessui/react';
import toast from 'react-hot-toast';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { convertSecondsToDuration, getDayJsDuration } from '#/utils/time.util';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { BaseControlledDatePicker } from '#/base/components/base-date-picker.component';
import { BaseControlledTimeInput } from '#/base/components/base-time-input.component';
import { StudentUserControlledPicker } from '#/user/components/student-user-picker.component';

import type { FormProps, IconName } from '#/base/models/base.model';
import type { ExamScheduleUpsertFormData } from '../models/exam-form-data.model';
import type { ExamSchedule } from '../models/exam.model';

type Props = FormProps<
  'div',
  ExamScheduleUpsertFormData,
  Promise<ExamSchedule | null>
> & {
  examId: number;
};

const calendarSelectorProps = {
  minDate: new Date(`${new Date().getFullYear() - 5}-01-01`),
  maxDate: new Date(`${new Date().getFullYear() + 5}-12-31`),
};

const timeInputRules = { deps: ['startTime', 'endTime'] };

const schema = z
  .object({
    startDate: z
      .date({ required_error: 'Start date is required' })
      .min(new Date(`${new Date().getFullYear()}-01-01`), 'Date is invalid'),
    endDate: z
      .date({ required_error: 'End date is required' })
      .min(
        new Date(`${new Date().getFullYear()}-01-01`),
        'End date is invalid',
      ),
    startTime: z
      .string({ required_error: 'Start time is required' })
      .refine((value) => isTime(value, { hourFormat: 'hour12' }), {
        message: 'Start time is invalid',
      }),
    endTime: z
      .string({ required_error: 'End time is required' })
      .refine((value) => isTime(value, { hourFormat: 'hour12' }), {
        message: 'End time is invalid',
      }),
    studentIds: z.array(z.number()).nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate && data.startTime && data.endTime) {
      const startDateTime = dayjs(
        `${dayjs(data.startDate).format('YYYY-MM-DD')} ${data.startTime}`,
        'YYYY-MM-DD hh:mm A',
      );

      const endDateTime = dayjs(
        `${dayjs(data.endDate).format('YYYY-MM-DD')} ${data.endTime}`,
        'YYYY-MM-DD hh:mm A',
      );

      const duration = getDayJsDuration(
        endDateTime.toDate(),
        startDateTime.toDate(),
      ).asSeconds();

      if (duration <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Time is invalid',
          path: ['startTime'],
        });
      }
    }

    if (data.studentIds === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Assign students',
        path: ['studentIds'],
      });
    }
  });

const defaultValues: Partial<ExamScheduleUpsertFormData> = {
  startDate: undefined,
  endDate: undefined,
  startTime: undefined,
  endTime: undefined,
  studentIds: undefined,
};

export const ExamScheduleUpsertForm = memo(function ({
  className,
  examId,
  formData,
  loading: formLoading,
  isDone,
  onDone,
  onSubmit,
  onDelete,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const {
    formState: { isSubmitting },
    control,
    reset,
    handleSubmit,
    setValue,
  } = useForm<ExamScheduleUpsertFormData>({
    shouldFocusError: false,
    defaultValues: formData || defaultValues,
    resolver: zodResolver(schema),
  });

  const startDate = useWatch({ control, name: 'startDate' });
  const endDate = useWatch({ control, name: 'endDate' });
  const startTime = useWatch({ control, name: 'startTime' });
  const endTime = useWatch({ control, name: 'endTime' });

  const loading = useMemo(
    () => formLoading || isSubmitting || isDone,
    [formLoading, isSubmitting, isDone],
  );

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

  const [scheduleButtonLabel, scheduleButtonIconName] = useMemo(
    () => [
      formData ? 'Save Changes' : 'Set Schedule',
      (formData ? 'floppy-disk-back' : 'calendar-check') as IconName,
    ],
    [formData],
  );

  useEffect(() => {
    setValue('endDate', startDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  const submitForm = useCallback(
    async (data: ExamScheduleUpsertFormData) => {
      try {
        await onSubmit({ ...data, examId });
        toast.success(
          !formData ? 'Created lesson schedule' : 'Update lesson schedule',
        );
        onDone && onDone(true);
        navigate(-1);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [examId, formData, onSubmit, onDone, navigate],
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
              disabled={loading}
            >
              Reset Fields
            </BaseButton>
            <div className='group-button w-full -3xs:w-auto'>
              <BaseButton
                className='w-full'
                type='submit'
                rightIconName={scheduleButtonIconName}
                loading={loading}
                disabled={isDone}
              >
                {scheduleButtonLabel}
              </BaseButton>
              {!!formData && (
                <BaseDropdownMenu disabled={loading}>
                  <Menu.Item
                    as={BaseDropdownButton}
                    className='text-red-500'
                    iconName='trash'
                    onClick={onDelete}
                    disabled={loading}
                  >
                    Delete
                  </Menu.Item>
                </BaseDropdownMenu>
              )}
            </div>
          </div>
        </div>
        <div className='mx-auto w-full max-w-[600px] pt-5'>
          <fieldset
            className='group/field flex flex-wrap gap-5'
            disabled={isSubmitting || isDone}
          >
            <div className='w-full'>
              <BaseControlledDatePicker
                name='startDate'
                label='Date'
                control={control}
                iconName='calendar'
                calendarSelectorProps={calendarSelectorProps}
                asterisk
                fullWidth
              />
            </div>
            <div className='flex w-full flex-col items-start justify-between gap-5 -2xs:flex-row'>
              <BaseControlledTimeInput
                name='startTime'
                label='Start Time'
                iconName='clock'
                control={control}
                rules={timeInputRules}
                fullWidth
                asterisk
              />
              <BaseControlledTimeInput
                name='endTime'
                label='End Time'
                iconName='clock'
                control={control}
                rules={timeInputRules}
                asterisk
                fullWidth
              />
            </div>
            <div className='flex w-full items-baseline justify-center gap-x-2 border-y border-accent/20 bg-white px-4 py-2.5'>
              <span>Exam Duration:</span>
              <span
                className={cx(
                  isDurationValid ? 'font-medium' : 'text-sm italic',
                )}
              >
                {durationText}
              </span>
            </div>
            <div className='flex w-full items-start gap-5'>
              <StudentUserControlledPicker
                name='studentIds'
                label='Students'
                control={control}
                asterisk
              />
            </div>
          </fieldset>
        </div>
      </form>
    </div>
  );
});
