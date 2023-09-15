import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import isTime from 'validator/lib/isTime';
import toast from 'react-hot-toast';
import cx from 'classix';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseControlledDatePicker } from '#/base/components/base-date-picker.component';
import { BaseControlledTimeInput } from '#/base/components/base-time-input.component';
import { StudentUserControlledPicker } from '#/user/components/student-user-picker.component';

import type { FieldErrors } from 'react-hook-form';
import type { FormProps } from '#/base/models/base.model';
import type {
  LessonSchedule,
  LessonScheduleUpsertFormData,
} from '../models/lesson.model';

type Props = FormProps<'div'> & {
  lessonId: number;
  onSubmit: (data: LessonScheduleUpsertFormData) => Promise<LessonSchedule>;
  lessonScheduleFormData?: LessonScheduleUpsertFormData;
};

const LESSONS_PATH = `/${teacherBaseRoute}/${teacherRoutes.lesson.to}`;

const calendarSelectorProps = {
  minDate: new Date(`${new Date().getFullYear() - 5}-01-01`),
  maxDate: new Date(`${new Date().getFullYear() + 5}-12-31`),
};

const schema = z.object({
  startDate: z
    .date()
    .min(
      new Date(`${new Date().getFullYear()}-01-01`),
      'Start date is invalid',
    ),
  startTime: z
    .string()
    .refine((value) => isTime(value, { hourFormat: 'hour12' }), {
      message: 'Start time is invalid',
    }),
  studentIds: z.array(z.number()).nullable().optional(),
});

const defaultValues: Partial<LessonScheduleUpsertFormData> = {
  startDate: undefined,
  startTime: undefined,
  studentIds: undefined,
};

export const LessonScheduleUpsertForm = memo(function ({
  className,
  lessonId,
  lessonScheduleFormData,
  isDone,
  onDone,
  onSubmit,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LessonScheduleUpsertFormData>({
    shouldFocusError: false,
    defaultValues: lessonScheduleFormData || defaultValues,
    resolver: zodResolver(schema),
  });

  const handleSubmitError = useCallback(
    (errors: FieldErrors<LessonScheduleUpsertFormData>) => {
      const errorMessage = Object.entries(errors)[0][1].message;
      toast.error(errorMessage || '');
    },
    [],
  );

  const submitForm = useCallback(
    async (data: LessonScheduleUpsertFormData) => {
      try {
        const lessonSchedule = await onSubmit(data);

        toast.success(
          // TODO get lesson title or number
          `Added lesson schedule to Lesson`,
        );

        onDone && onDone(true);
        navigate(LESSONS_PATH);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [onDone, onSubmit, navigate],
  );

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <form onSubmit={handleSubmit(submitForm, handleSubmitError)}>
        <fieldset
          className='group/field flex flex-wrap gap-5'
          disabled={isSubmitting || isDone}
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
          <div className='flex w-full items-start gap-5'>
            <StudentUserControlledPicker
              name='studentIds'
              label='Students'
              control={control}
            />
          </div>
        </fieldset>
      </form>
    </div>
  );
});
