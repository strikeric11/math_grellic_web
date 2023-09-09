import { memo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import isTime from 'validator/lib/isTime';
import toast from 'react-hot-toast';
import cx from 'classix';

import { LESSONS_PATH } from '#/utils/path.util';
import { RecordStatus } from '#/core/models/core.model';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { BaseStepperStep } from '#/base/components/base-stepper-step.component';
import { BaseStepper } from '#/base/components/base-stepper.component';
import { LessonUpsertFormStep1 } from './lesson-upsert-form-step-1.component';
import { LessonUpsertFormStep2 } from './lesson-upsert-form-step-2.component';

import type { FormProps } from '#/base/models/base.model';
import type { Lesson, LessonUpsertFormData } from '../models/lesson.model';

type Props = FormProps<'div'> & {
  onSubmit: (data: LessonUpsertFormData) => Promise<Lesson>;
};

const schema = z
  .object({
    orderNumber: z
      .number({
        required_error: 'Order number is required',
        invalid_type_error: 'Lesson number is invalid ',
      })
      .int()
      .gt(0),
    durationSeconds: z
      .number({ invalid_type_error: 'Duration is invalid' })
      .int()
      .optional(),
    title: z
      .string()
      .min(1, 'Lesson title is required')
      .max(255, 'Title is too long'),
    videoUrl: z.string().url().max(255, 'Url is too long'),
    description: z.string().optional(),
    status: z.nativeEnum(RecordStatus),
    startDate: z
      .date()
      .min(
        new Date(`${new Date().getFullYear()}-01-01`),
        'Start date is invalid',
      )
      .optional(),
    startTime: z
      .string()
      .refine((value) => isTime(value, { hourFormat: 'hour12' }), {
        message: 'Start time is invalid',
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (!!data.startDate && !data.startTime) {
        return false;
      }
      return true;
    },
    {
      message: 'Start time is invalid',
      path: ['startTime'],
    },
  )
  .refine(
    (data) => {
      if (!!data.startTime && !data.startDate) {
        return false;
      }
      return true;
    },
    {
      message: 'Start date is invalid',
      path: ['startDate'],
    },
  );

const defaultValues: Partial<LessonUpsertFormData> = {
  title: '',
  videoUrl: '',
  description: '',
  status: RecordStatus.Draft,
};

export const LessonUpsertForm = memo(function ({
  className,
  isDone,
  onDone,
  onSubmit,
  ...moreProps
}: Props) {
  const navigate = useNavigate();
  const setLessonFormData = useBoundStore((state) => state.setLessonFormData);

  const methods = useForm<LessonUpsertFormData>({
    shouldFocusError: false,
    defaultValues,
    resolver: zodResolver(schema),
  });

  const {
    formState: { isSubmitting },
    trigger,
    reset,
    getValues,
    handleSubmit,
  } = methods;

  const submitForm = useCallback(
    async (data: LessonUpsertFormData, status?: RecordStatus) => {
      try {
        const targetData = status ? { ...data, status } : data;
        const lesson = await onSubmit(targetData);

        toast.success(
          `Lesson No. ${lesson.orderNumber} — ${lesson.title}, created`,
        );

        onDone && onDone(true);
        navigate(LESSONS_PATH);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [onSubmit, onDone, navigate],
  );

  const handlePreview = useCallback(async () => {
    const isValid = await trigger();

    if (!isValid) {
      toast.error('Please fill in all the required fields');
      return;
    }

    setLessonFormData(getValues());
    window.open(`${LESSONS_PATH}/preview`, '_blank')?.focus();
  }, [trigger, getValues, setLessonFormData]);

  useEffect(() => {
    // Set lessonFormData to undefined when unmounting component
    return () => {
      setLessonFormData(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit((data) => submitForm(data))}>
          <BaseStepper
            disabled={isSubmitting || isDone}
            onReset={() => reset()}
            controlsRightContent={
              <div className='group-button'>
                <BaseButton
                  rightIconName='share-fat'
                  loading={isSubmitting}
                  disabled={isDone}
                  onClick={handleSubmit((data) =>
                    submitForm(data, RecordStatus.Published),
                  )}
                >
                  Publish Now
                </BaseButton>
                <BaseDropdownMenu disabled={isSubmitting || isDone}>
                  <Menu.Item
                    as={BaseDropdownButton}
                    type='submit'
                    iconName='floppy-disk-back'
                    disabled={isSubmitting || isDone}
                  >
                    Save as Draft
                  </Menu.Item>
                  <Menu.Item
                    as={BaseDropdownButton}
                    iconName='file-text'
                    onClick={handlePreview}
                    disabled={isSubmitting || isDone}
                  >
                    Preview
                  </Menu.Item>
                </BaseDropdownMenu>
              </div>
            }
          >
            <BaseStepperStep label='Lesson Info'>
              <LessonUpsertFormStep1 disabled={isSubmitting || isDone} />
            </BaseStepperStep>
            <BaseStepperStep label='Lesson Schedule'>
              <LessonUpsertFormStep2 disabled={isSubmitting || isDone} />
            </BaseStepperStep>
          </BaseStepper>
        </form>
      </FormProvider>
    </div>
  );
});
