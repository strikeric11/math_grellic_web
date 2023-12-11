import { memo, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { Menu } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import isTime from 'validator/lib/isTime';
import toast from 'react-hot-toast';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { convertSecondsToDuration, getDayJsDuration } from '#/utils/time.util';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseControlledDatePicker } from '#/base/components/base-date-picker.component';
import { BaseControlledInput } from '#/base/components/base-input.component';
import { BaseControlledRichTextEditor } from '#/base/components/base-rich-text-editor.component';
import { BaseControlledTimeInput } from '#/base/components/base-time-input.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { StudentUserControlledPicker } from '#/user/components/student-user-picker.component';

import type { FormProps, IconName } from '#/base/models/base.model';
import type { MeetingScheduleUpsertFormData } from '../models/schedule-form-data.model';
import type { MeetingSchedule } from '../models/schedule.model';

type Props = FormProps<
  'div',
  MeetingScheduleUpsertFormData,
  Promise<MeetingSchedule>
>;

const MEETING_CALENDAR_PATH = `/${teacherBaseRoute}/${teacherRoutes.schedule.to}/${teacherRoutes.schedule.meeting.to}`;

const calendarSelectorProps = {
  minDate: new Date(`${new Date().getFullYear() - 5}-01-01`),
  maxDate: new Date(`${new Date().getFullYear() + 5}-12-31`),
};

const timeInputRules = { deps: ['startTime', 'endTime'] };

const schema = z
  .object({
    title: z
      .string()
      .min(1, 'Meeting title is required')
      .max(255, 'Title is too long'),
    meetingUrl: z.string().url('Url is invalid').max(255, 'Url is too long'),
    description: z.string().optional(),
    // Schedule
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
    studentIds: z
      .array(z.number(), { required_error: 'Assign students' })
      .nullable(),
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

const defaultValues: Partial<MeetingScheduleUpsertFormData> = {
  title: '',
  meetingUrl: '',
  description: '',
  startDate: undefined,
  endDate: undefined,
  startTime: undefined,
  endTime: undefined,
  studentIds: undefined,
};

export const MeetingScheduleUpsertForm = memo(function ({
  className,
  formData,
  loading: formLoading,
  isDone,
  onDone,
  onSubmit,
  onDelete,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const isEdit = useMemo(() => !!formData, [formData]);

  const {
    formState: { isSubmitting },
    control,
    reset,
    setValue,
    handleSubmit,
  } = useForm<MeetingScheduleUpsertFormData>({
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
    reset(isEdit ? formData : defaultValues);
  }, [isEdit, formData, reset]);

  const submitForm = useCallback(
    async (data: MeetingScheduleUpsertFormData) => {
      try {
        const meetingSchedule = await onSubmit(data);

        toast.success(
          `${isEdit ? 'Updated' : 'Created'} ${meetingSchedule.title}`,
        );

        onDone && onDone(true);
        navigate(MEETING_CALENDAR_PATH);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [isEdit, onSubmit, onDone, navigate],
  );

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <form onSubmit={handleSubmit(submitForm)}>
        <div>
          <BaseDivider className='mb-2.5 pt-2.5' />
          <div className='flex w-full items-center justify-between'>
            <BaseButton
              variant='link'
              size='sm'
              rightIconName='arrow-counter-clockwise'
              onClick={handleReset}
              disabled={loading}
            >
              Reset Fields
            </BaseButton>
            <div className='group-button'>
              <BaseButton
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
            disabled={loading}
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
            <div className='flex w-full items-start justify-between gap-5'>
              <BaseControlledTimeInput
                name='startTime'
                label='Start Time'
                iconName='clock'
                control={control}
                rules={timeInputRules}
                asterisk
                fullWidth
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
              <span>Meeting Duration:</span>
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
            <BaseDivider />
            <div className='flex w-full items-start justify-between gap-5'>
              <BaseControlledInput
                label='Title'
                name='title'
                control={control}
                fullWidth
                asterisk
              />
              <BaseControlledInput
                label='Meeting Url'
                name='meetingUrl'
                control={control}
                fullWidth
                asterisk
              />
            </div>
            <div className='flex w-full flex-col gap-5'>
              <BaseControlledRichTextEditor
                className='max-w-[600px]'
                scrollbarsClassName='max-h-40'
                label='Description'
                name='description'
                control={control}
                disabled={loading}
              />
            </div>
          </fieldset>
        </div>
      </form>
    </div>
  );
});
