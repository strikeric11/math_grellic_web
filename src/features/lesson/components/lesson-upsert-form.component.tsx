import { memo, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import isTime from 'validator/lib/isTime';
import toast from 'react-hot-toast';
import cx from 'classix';

import { getErrorMessage } from '#/utils/string.util';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { RecordStatus } from '#/core/models/core.model';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseStepperStep } from '#/base/components/base-stepper-step.component';
import { BaseStepper } from '#/base/components/base-stepper.component';
import { LessonUpsertFormStep1 } from './lesson-upsert-form-step-1.component';
import { LessonUpsertFormStep2 } from './lesson-upsert-form-step-2.component';

import type { FieldErrors } from 'react-hook-form';
import type { FormProps, IconName } from '#/base/models/base.model';
import type { Lesson } from '../models/lesson.model';
import type { LessonUpsertFormData } from '../models/lesson-form-data.model';

type Props = FormProps<'div', LessonUpsertFormData, Promise<Lesson>>;

const LESSON_PREVIEW_PATH = `/${teacherBaseRoute}/${teacherRoutes.lesson.to}/${teacherRoutes.lesson.previewTo}`;
const LESSON_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.lesson.to}`;

const schema = z
  .object({
    orderNumber: z
      .number({
        required_error: 'Lesson number is required',
        invalid_type_error: 'Lesson number is invalid ',
      })
      .int()
      .gt(0),
    duration: z
      .string()
      .refine(
        (value) => isTime(value, { hourFormat: 'hour24', mode: 'withSeconds' }),
        {
          message: 'Duration is invalid',
        },
      )
      .optional(),
    title: z
      .string()
      .min(1, 'Lesson title is required')
      .max(255, 'Title is too long'),
    videoUrl: z
      .string()
      .url('Video embed url is invalid')
      .max(255, 'Url is too long'),
    description: z.string().optional(),
    excerpt: z.string().optional(),
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
    studentIds: z.array(z.number()).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate || data.startTime) {
      if (!data.startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Start date is invalid',
          path: ['startDate'],
        });
      }

      if (!data.startTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Start time is invalid',
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

const defaultValues: Partial<LessonUpsertFormData> = {
  title: '',
  videoUrl: '',
  description: '',
  excerpt: '',
  status: RecordStatus.Draft,
  orderNumber: null,
  duration: undefined,
  startDate: undefined,
  startTime: undefined,
  studentIds: [],
};

export const LessonUpsertForm = memo(function ({
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
  const setLessonFormData = useBoundStore((state) => state.setLessonFormData);

  const [isEdit, isEditPublished] = useMemo(
    () => [!!formData, formData?.status === RecordStatus.Published],
    [formData],
  );

  const methods = useForm<LessonUpsertFormData>({
    shouldFocusError: false,
    defaultValues: formData || defaultValues,
    resolver: zodResolver(schema),
  });

  const {
    formState: { isSubmitting },
    trigger,
    reset,
    getValues,
    handleSubmit,
  } = methods;

  const loading = useMemo(
    () => formLoading || isSubmitting || isDone,
    [formLoading, isSubmitting, isDone],
  );

  const [publishButtonLabel, publishButtonIconName]: [string, IconName] =
    useMemo(
      () => [
        isEditPublished ? 'Save Changes' : 'Publish Now',
        (isEditPublished ? 'floppy-disk-back' : 'share-fat') as IconName,
      ],
      [isEditPublished],
    );

  const handleReset = useCallback(() => {
    reset(isEdit ? formData : defaultValues);
  }, [isEdit, formData, reset]);

  const handleSubmitError = useCallback(
    (errors: FieldErrors<LessonUpsertFormData>) => {
      const errorMessage = getErrorMessage(errors);
      toast.error(errorMessage || '');
    },
    [],
  );

  const submitForm = useCallback(
    async (data: LessonUpsertFormData, status?: RecordStatus) => {
      try {
        const targetData = status ? { ...data, status } : data;
        const lesson = await onSubmit(targetData);

        toast.success(
          `${isEdit ? 'Updated' : 'Created'} ${lesson.title} (No. ${
            lesson.orderNumber
          })`,
        );

        onDone && onDone(true);
        navigate(LESSON_LIST_PATH);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [isEdit, onSubmit, onDone, navigate],
  );

  const handlePreview = useCallback(async () => {
    const isValid = await trigger();

    if (!isValid) {
      toast.error('Please fill in all the required fields');
      return;
    }

    setLessonFormData(getValues());
    window.open(LESSON_PREVIEW_PATH, '_blank')?.focus();
  }, [trigger, getValues, setLessonFormData]);

  useEffect(() => {
    // Set lessonFormData to undefined when unmounting component
    return () => {
      setLessonFormData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit((data) => submitForm(data), handleSubmitError)}
        >
          <BaseStepper
            disabled={loading}
            onReset={handleReset}
            controlsRightContent={
              <div className='group-button w-full sm:w-auto'>
                <BaseButton
                  className='w-full'
                  rightIconName={publishButtonIconName}
                  loading={isSubmitting || loading}
                  disabled={isDone}
                  onClick={handleSubmit(
                    (data) => submitForm(data, RecordStatus.Published),
                    handleSubmitError,
                  )}
                >
                  {publishButtonLabel}
                </BaseButton>
                <BaseDropdownMenu disabled={loading}>
                  {(!isEdit || !isEditPublished) && (
                    <Menu.Item
                      as={BaseDropdownButton}
                      type='submit'
                      iconName='floppy-disk-back'
                      disabled={loading}
                    >
                      Save as Draft
                    </Menu.Item>
                  )}
                  <Menu.Item
                    as={BaseDropdownButton}
                    iconName='file-text'
                    onClick={handlePreview}
                    disabled={loading}
                  >
                    Preview
                  </Menu.Item>
                  {isEdit && (
                    <>
                      <BaseDivider className='my-1' />
                      <Menu.Item
                        as={BaseDropdownButton}
                        className='text-red-500'
                        iconName='trash'
                        onClick={onDelete}
                        disabled={loading}
                      >
                        Delete
                      </Menu.Item>
                    </>
                  )}
                </BaseDropdownMenu>
              </div>
            }
          >
            <BaseStepperStep label='Lesson Info'>
              <LessonUpsertFormStep1 disabled={loading} />
            </BaseStepperStep>
            {(!isEdit || !isEditPublished) && (
              <BaseStepperStep label='Lesson Schedule'>
                <LessonUpsertFormStep2 disabled={loading} />
              </BaseStepperStep>
            )}
          </BaseStepper>
        </form>
      </FormProvider>
    </div>
  );
});
