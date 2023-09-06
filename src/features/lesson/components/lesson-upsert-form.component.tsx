import { memo, useCallback, useEffect } from 'react';
import { Menu } from '@headlessui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import isTime from 'validator/lib/isTime';
import cx from 'classix';

import { LESSONS_PATH } from '#/utils/path.util';
import { RecordStatus } from '#/core/models/core.model';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { BaseStepperStep } from '#/base/components/base-stepper-step.component';
import { BaseStepper } from '#/base/components/base-stepper.component';
import { LessonUpsertFormData } from '#/lesson/models/lesson.model';
import { LessonUpsertFormStep1 } from './lesson-upsert-form-step-1.component';
import { LessonUpsertFormStep2 } from './lesson-upsert-form-step-2.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  onComplete?: () => void;
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
  onComplete,
  ...moreProps
}: Props) {
  const setLessonFormData = useBoundStore((state) => state.setLessonFormData);

  const methods = useForm<LessonUpsertFormData>({
    shouldFocusError: false,
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { trigger, reset, getValues, handleSubmit } = methods;

  const submitForm = useCallback(
    async (data: LessonUpsertFormData) => {
      try {
        // TODO
        // const militaryTime = dayjs(
        //   `${values.formattedValue} ${timeSuffix}`,
        //   'h:mm a',
        // ).format('HH:mm');
        onComplete && onComplete();
        console.log('success', data);
      } catch (error) {
        // TODO
        console.log('error', error);
      }
    },
    [onComplete],
  );

  const handlePreview = useCallback(async () => {
    const isValid = await trigger();

    if (!isValid) {
      return;
    }

    setLessonFormData(getValues());
    window.open(`${LESSONS_PATH}/preview`, '_blank')?.focus();
  }, [trigger, getValues, setLessonFormData]);

  useEffect(() => {
    return () => {
      setLessonFormData(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(submitForm, (errors) => {
            console.log(methods.getValues());
            console.log(errors);
          })}
        >
          <BaseStepper
            onReset={() => reset()}
            controlsRightContent={
              <div className='group-button'>
                <BaseButton type='submit' rightIconName='share-fat'>
                  Publish Now
                </BaseButton>
                <BaseDropdownMenu>
                  <Menu.Item
                    as={BaseDropdownButton}
                    iconName='floppy-disk-back'
                  >
                    Save as Draft
                  </Menu.Item>
                  <Menu.Item
                    as={BaseDropdownButton}
                    iconName='file-text'
                    onClick={handlePreview}
                  >
                    Preview
                  </Menu.Item>
                </BaseDropdownMenu>
              </div>
            }
          >
            <BaseStepperStep label='Lesson Info'>
              <LessonUpsertFormStep1 />
            </BaseStepperStep>
            <BaseStepperStep label='Lesson Schedule'>
              <LessonUpsertFormStep2 />
            </BaseStepperStep>
          </BaseStepper>
        </form>
      </FormProvider>
    </div>
  );
});
