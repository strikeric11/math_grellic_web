import { memo, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { Menu } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import isTime from 'validator/lib/isTime';
import toast from 'react-hot-toast';
import cx from 'classix';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { RecordStatus } from '#/core/models/core.model';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseStepperStep } from '#/base/components/base-stepper-step.component';
import { BaseStepper } from '#/base/components/base-stepper.component';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { defaultQuestion } from '#/exam/helpers/exam-form.helper';
import { ActivityUpsertFormStep1 } from './activity-upsert-form-step-1.component';
import { ActivityUpsertFormLevel } from './activity-upsert-form-step-level.component';
import {
  ActivityCategoryLevel,
  ActivityCategoryType,
  ActivityGame,
} from '../models/activity.model';

import type { FormProps, IconName } from '#/base/models/base.model';
import type { Activity } from '../models/activity.model';
import type { ActivityUpsertFormData } from '../models/activity-form-data.model';

type Props = FormProps<'div', ActivityUpsertFormData, Promise<Activity>>;

const ACTIVITY_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.activity.to}`;

const choiceSchema = z.object({
  id: z.number().optional(),
  orderNumber: z
    .number({ required_error: 'Choice number is required' })
    .int()
    .gt(0, 'Choice number is invalid'),
  text: z.string().min(1, 'Choice is required'),
  isExpression: z.boolean(),
  isCorrect: z.boolean(),
});

const questionSchema = z.object({
  id: z.number().optional(),
  orderNumber: z
    .number({ required_error: 'Question number is required' })
    .int()
    .gt(0, 'Question number is invalid'),
  text: z.string().min(1, 'Question is required'),
  choices: z.array(choiceSchema).min(2),
});

const categorySchema = z.object({
  id: z.number().optional(),
  level: z.nativeEnum(ActivityCategoryLevel),
  randomizeQuestions: z.boolean(),
  visibleQuestionsCount: z
    .number({
      required_error: 'Visible questions is required',
      invalid_type_error: 'Visible questions is invalid',
    })
    .int()
    .gt(0, 'Visible questions should be greater than zero'),
  questions: z.array(questionSchema).min(1),
  correctAnswerCount: z
    .number()
    .int()
    .gt(0, 'Correct answer could should be greater than zero')
    .optional(),
  pointsPerQuestion: z
    .number()
    .int()
    .gt(0, 'Points per question should be greater than zero')
    .optional(),
  duration: z
    .string()
    .refine(
      (value) => isTime(value, { hourFormat: 'hour24', mode: 'withSeconds' }),
      {
        message: 'Duration is invalid',
      },
    )
    .optional(),
});

const schema = z
  .object({
    orderNumber: z
      .number({
        required_error: 'Exam number is required',
        invalid_type_error: 'Exam number is invalid ',
      })
      .int()
      .gt(0),
    title: z
      .string()
      .min(1, 'Exam title is required')
      .max(255, 'Title is too long'),
    status: z.nativeEnum(RecordStatus),
    game: z.object(
      {
        name: z.nativeEnum(ActivityGame),
        type: z.nativeEnum(ActivityCategoryType),
      },
      { required_error: 'Game is required' },
    ),
    description: z.string().optional(),
    excerpt: z.string().optional(),
    categories: z.array(categorySchema).min(1),
  })
  .superRefine((data, ctx) => {
    if (data.game.type === ActivityCategoryType.Point) {
      data.categories?.forEach((category, index) => {
        if (!category.duration) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Duration is invalid',
            path: [`categories.${index}.duration`],
          });
        }

        if (!category.pointsPerQuestion) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Points per question should be greater than zero',
            path: [`categories.${index}.pointsPerQuestion`],
          });
        }
      });
    } else {
      data.categories?.forEach((category, index) => {
        if (!category.correctAnswerCount) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Correct answer could should be greater than zero',
            path: [`categories.${index}.correctAnswerCount`],
          });
        }
      });
    }
  });

const defaultValues: Partial<ActivityUpsertFormData> = {
  title: '',
  description: '',
  excerpt: '',
  status: RecordStatus.Draft,
  orderNumber: null,
  game: undefined,
  categories: [
    {
      level: ActivityCategoryLevel.Easy,
      questions: [defaultQuestion],
      randomizeQuestions: false,
    },
    {
      level: ActivityCategoryLevel.Average,
      questions: [defaultQuestion],
      randomizeQuestions: false,
    },
    {
      level: ActivityCategoryLevel.Difficult,
      questions: [defaultQuestion],
      randomizeQuestions: false,
    },
  ],
};

export const ActivityUpsertForm = memo(function ({
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
  const setActivityFormData = useBoundStore(
    (state) => state.setActivityFormData,
  );

  const [isEdit, isEditPublished] = useMemo(
    () => [!!formData, formData?.status === RecordStatus.Published],
    [formData],
  );

  const methods = useForm<ActivityUpsertFormData>({
    shouldFocusError: false,
    defaultValues: formData || defaultValues,
    resolver: zodResolver(schema),
  });

  const {
    formState: { isSubmitting },
    reset,
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
    (errors: FieldErrors<ActivityUpsertFormData>) => {
      let errorMessage = '';

      if (errors.categories?.length) {
        const filteredCategories = (errors.categories as any)?.filter(
          (c: any) => !!c,
        );

        if (filteredCategories[0].questions?.length) {
          errorMessage = 'Invalid level question';
        } else {
          errorMessage =
            (Object.entries(filteredCategories[0])[0][1] as any)?.message || '';
        }
      } else {
        errorMessage = Object.entries(errors)[0][1]?.message || '';
      }

      toast.error(errorMessage || '');
    },
    [],
  );

  const submitForm = useCallback(
    async (data: ActivityUpsertFormData, status?: RecordStatus) => {
      try {
        const targetData = status ? { ...data, status } : data;
        const activity = await onSubmit(targetData);

        toast.success(
          `${isEdit ? 'Updated' : 'Created'} ${activity.title} (No. ${
            activity.orderNumber
          })`,
        );

        onDone && onDone(true);
        navigate(ACTIVITY_LIST_PATH);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [isEdit, onSubmit, onDone, navigate],
  );

  // const handlePreview = useCallback(async () => {
  //   const isValid = await trigger();

  //   if (!isValid) {
  //     toast.error('Please fill in all the required fields');
  //     return;
  //   }

  //   setActivityFormData(getValues());
  //   window.open(ACTIVITY_PREVIEW_PATH, '_blank')?.focus();
  // }, [trigger, getValues, setActivityFormData]);

  useEffect(() => {
    // Set lessonFormData to undefined when unmounting component
    return () => {
      setActivityFormData();
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
              <div className='group-button'>
                <BaseButton
                  rightIconName={publishButtonIconName}
                  loading={loading}
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
                  {/* <Menu.Item
                    as={BaseDropdownButton}
                    iconName='file-text'
                    onClick={handlePreview}
                    disabled={loading}
                  >
                    Preview
                  </Menu.Item> */}
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
            <BaseStepperStep label='Activity Info'>
              <ActivityUpsertFormStep1 />
            </BaseStepperStep>
            <BaseStepperStep label='Easy Questions'>
              <ActivityUpsertFormLevel categoryIndex={0} />
            </BaseStepperStep>
            <BaseStepperStep label='Average Questions'>
              <ActivityUpsertFormLevel categoryIndex={1} />
            </BaseStepperStep>
            <BaseStepperStep label='Difficult Questions'>
              <ActivityUpsertFormLevel categoryIndex={2} />
            </BaseStepperStep>
          </BaseStepper>
        </form>
      </FormProvider>
    </div>
  );
});
