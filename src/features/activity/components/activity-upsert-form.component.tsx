import { memo, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FieldErrors, FormProvider, useForm, useWatch } from 'react-hook-form';
import { Menu } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import isTime from 'validator/lib/isTime';
import isBase64 from 'validator/lib/isBase64';
import toast from 'react-hot-toast';
import cx from 'classix';

import { getErrorMessage } from '#/utils/string.util';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { ExActTextType, RecordStatus } from '#/core/models/core.model';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseStepperStep } from '#/base/components/base-stepper-step.component';
import { BaseStepper } from '#/base/components/base-stepper.component';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { defaultQuestion } from '#/exam/helpers/exam-form.helper';
import { createDefaultStageQuestion } from '../helpers/activity-form.helper';
import { ActivityUpsertFormStep1 } from './activity-upsert-form-step-1.component';
import { ActivityUpsertFormStepPointTimeLevel } from './activity-upsert-form-step-point-time-level.component';
import { ActivityUpsertFormStepStageLevel } from './activity-upsert-form-step-stage-level.component';
import {
  ActivityCategoryLevel,
  ActivityCategoryType,
  ActivityGame,
} from '../models/activity.model';

import type { FormProps, IconName } from '#/base/models/base.model';
import type { Activity } from '../models/activity.model';
import type {
  ActivityCategoryQuestionFormData,
  ActivityUpsertFormData,
} from '../models/activity-form-data.model';

type Props = FormProps<'div', ActivityUpsertFormData, Promise<Activity>>;

const ACTIVITY_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.activity.to}`;

const choiceSchema = z.object({
  id: z.number().optional(),
  orderNumber: z
    .number({ required_error: 'Choice number is required' })
    .int()
    .gt(0, 'Choice number is invalid'),
  text: z.string().optional(),
  textType: z.nativeEnum(ExActTextType),
  isCorrect: z.boolean(),
  imageData: z.string().optional(),
});

const questionSchema = z.object({
  id: z.number().optional(),
  orderNumber: z
    .number({ required_error: 'Question number is required' })
    .int()
    .gt(0, 'Question number is invalid'),
  text: z.string().optional(),
  textType: z.nativeEnum(ExActTextType),
  choices: z.array(choiceSchema).min(2),
  stageNumber: z.number().optional(),
  hintText: z.string().optional(),
  imageData: z.string().optional(),
});

const stageQuestionsSchema = z.object({
  questions: z.array(questionSchema).min(1),
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
  stageQuestions: z.array(stageQuestionsSchema).min(1).optional(),
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
  totalStageCount: z
    .number()
    .int()
    .gt(0, 'Stage count should be greater than zero')
    .optional(),
});

const schema = z
  .object({
    orderNumber: z
      .number({
        required_error: 'Activity number is required',
        invalid_type_error: 'Activity number is invalid ',
      })
      .int()
      .gt(0),
    title: z
      .string()
      .min(1, 'Activity title is required')
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
    slug: z.string().optional(),
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
    } else if (data.game.type === ActivityCategoryType.Time) {
      data.categories?.forEach((category, index) => {
        if (!category.correctAnswerCount) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Correct answer should be greater than zero',
            path: [`categories.${index}.correctAnswerCount`],
          });
        }
      });
    } else {
      data.categories?.forEach((category, index) => {
        if (!category.totalStageCount) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Total stage count should be greater than zero',
            path: [`categories.${index}.totalStageCount`],
          });
        }
      });
    }

    if (data.game.type === ActivityCategoryType.Stage) {
      data.categories?.forEach((category, index) => {
        category.stageQuestions?.forEach((stageQuestion, sIndex) => {
          stageQuestion.questions.forEach((question, qIndex) => {
            const isValid = question.choices.some((choice) => choice.isCorrect);
            if (!isValid) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Pick an answer from the choices',
                path: [
                  `categories.${index}.stageQuestions.${sIndex}.questions.${qIndex}.choices.0.text`,
                ],
              });
            }
            // Check question types
            if (
              question.textType === ExActTextType.Text &&
              !question.text?.trim().length
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Question is invalid',
                path: [
                  `categories.${index}.stageQuestions.${sIndex}.questions.${qIndex}.text`,
                ],
              });
            } else if (
              question.textType === ExActTextType.Image &&
              (!question.imageData ||
                (!data.slug?.trim() &&
                  !isBase64(question.imageData?.split(',').pop() || '')))
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Image is invalid',
                path: [
                  `categories.${index}.stageQuestions.${sIndex}.questions.${qIndex}.imageData`,
                ],
              });
            }
            // Check choices types
            question.choices.forEach((choice, cIndex) => {
              if (
                choice.textType === ExActTextType.Text &&
                !choice.text?.trim().length
              ) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: 'Choice is invalid',
                  path: [
                    `categories.${index}.stageQuestions.${sIndex}.questions.${qIndex}.choices.${cIndex}.text`,
                  ],
                });
              } else if (
                choice.textType === ExActTextType.Image &&
                (!choice.imageData ||
                  (!data.slug?.trim() &&
                    !isBase64(choice.imageData?.split(',').pop() || '')))
              ) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: 'Image is invalid',
                  path: [
                    `categories.${index}.stageQuestions.${sIndex}.questions.${qIndex}.choices.${cIndex}.imageData`,
                  ],
                });
              }
            });

            if (question.stageNumber == null) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Stage number should be greater than zero',
                path: [
                  `categories.${index}.stageQuestions.${sIndex}.questions.${qIndex}.stageNumber`,
                ],
              });
            }
          });
        });
      });
    } else {
      data.categories?.forEach((category, index) => {
        category.questions.forEach((question, qIndex) => {
          const isValid = question.choices.some((choice) => choice.isCorrect);
          if (!isValid) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Pick an answer from the choices',
              path: [`categories.${index}.questions.${qIndex}.choices.0.text`],
            });
          }

          // Check question types
          if (
            question.textType === ExActTextType.Text &&
            !question.text?.trim().length
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Question is invalid',
              path: [`categories.${index}.questions.${qIndex}.text`],
            });
          } else if (
            question.textType === ExActTextType.Image &&
            (!question.imageData ||
              (!data.slug?.trim() &&
                !isBase64(question.imageData?.split(',').pop() || '')))
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Image is invalid',
              path: [`categories.${index}.questions.${qIndex}.imageData`],
            });
          }
          // Check choices types
          question.choices.forEach((choice, cIndex) => {
            if (
              choice.textType === ExActTextType.Text &&
              !choice.text?.trim().length
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Choice is invalid',
                path: [
                  `categories.${index}.questions.${qIndex}.choices.${cIndex}.text`,
                ],
              });
            } else if (
              choice.textType === ExActTextType.Image &&
              (!choice.imageData ||
                (!data.slug?.trim() &&
                  !isBase64(choice.imageData?.split(',').pop() || '')))
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Image is invalid',
                path: [
                  `categories.${index}.questions.${qIndex}.choices.${cIndex}.imageData`,
                ],
              });
            }
          });
        });
      });
    }
  });

const defaultPointTimeCategories = [
  {
    level: ActivityCategoryLevel.Easy,
    questions: [defaultQuestion],
    stageQuestions: undefined,
    randomizeQuestions: false,
  },
  {
    level: ActivityCategoryLevel.Average,
    questions: [defaultQuestion],
    stageQuestions: undefined,
    randomizeQuestions: false,
  },
  {
    level: ActivityCategoryLevel.Difficult,
    questions: [defaultQuestion],
    stageQuestions: undefined,
    randomizeQuestions: false,
  },
];

const defaultStageCategories = [
  {
    level: ActivityCategoryLevel.Average,
    questions: [],
    stageQuestions: [
      {
        questions: [createDefaultStageQuestion(1)],
      },
    ],
    randomizeQuestions: false,
    totalStageCount: 1,
  },
];

const defaultValues: Partial<ActivityUpsertFormData> = {
  title: '',
  description: '',
  excerpt: '',
  status: RecordStatus.Draft,
  orderNumber: null,
  game: undefined,
  categories: [],
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
  const setExActImageEdit = useBoundStore((state) => state.setExActImageEdit);
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
    control,
    getValues,
    formState: { isSubmitting },
    reset,
    handleSubmit,
    setValue,
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

  const gameType = useWatch({ control, name: 'game.type' });

  const activityLevelComponent = useMemo(() => {
    if (gameType == null) {
      return (
        <div className='flex w-full justify-center'>
          <span>No game selected</span>
        </div>
      );
    }

    if (gameType !== ActivityCategoryType.Stage) {
      return <ActivityUpsertFormStepPointTimeLevel categoryIndex={0} />;
    }

    return <ActivityUpsertFormStepStageLevel categoryIndex={0} />;
  }, [gameType]);

  const handleReset = useCallback(() => {
    reset(isEdit ? formData : defaultValues);
  }, [isEdit, formData, reset]);

  const handleSubmitError = useCallback(
    (errors: FieldErrors<ActivityUpsertFormData>) => {
      const errorMessage = getErrorMessage(errors);
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

  const doSubmit = useCallback(
    (status?: RecordStatus) => () => {
      if (gameType === ActivityCategoryType.Stage) {
        const stageQuestions = getValues('categories.0.stageQuestions');

        const questions =
          stageQuestions?.reduce(
            (total, stageQuestion) => [...total, ...stageQuestion.questions],
            [] as ActivityCategoryQuestionFormData[],
          ) || [];

        const transformedQuestions = questions.map((question, index) => ({
          ...question,
          orderNumber: index + 1,
        }));

        setValue('categories.0.questions', transformedQuestions);
      }

      handleSubmit((data) => submitForm(data, status), handleSubmitError)();
    },
    [
      gameType,
      submitForm,
      handleSubmit,
      handleSubmitError,
      setValue,
      getValues,
    ],
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
    switch (gameType) {
      case ActivityCategoryType.Point:
      case ActivityCategoryType.Time: {
        const categories =
          formData?.categories &&
          formData?.game.type !== ActivityCategoryType.Stage
            ? formData.categories
            : defaultPointTimeCategories;

        setValue('categories', categories);
        break;
      }
      case ActivityCategoryType.Stage: {
        const categories =
          formData?.categories &&
          formData?.game.type === ActivityCategoryType.Stage
            ? formData.categories
            : defaultStageCategories;

        setValue('categories', categories);
        break;
      }
      default:
        setValue('categories', []);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameType]);

  useEffect(() => {
    // Clear image edit value
    setExActImageEdit();

    // Set lessonFormData to undefined when unmounting component
    return () => {
      setActivityFormData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <FormProvider {...methods}>
        <form onSubmit={doSubmit()}>
          <BaseStepper
            disabled={loading}
            onReset={handleReset}
            controlsRightContent={
              <div className='group-button'>
                <BaseButton
                  rightIconName={publishButtonIconName}
                  loading={loading}
                  disabled={isDone}
                  onClick={doSubmit(RecordStatus.Published)}
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
                    <Menu.Item
                      as={BaseDropdownButton}
                      className='text-red-500'
                      iconName='trash'
                      onClick={onDelete}
                      disabled={loading}
                    >
                      Delete
                    </Menu.Item>
                  )}
                </BaseDropdownMenu>
              </div>
            }
          >
            <BaseStepperStep label='Activity Info'>
              <ActivityUpsertFormStep1 />
            </BaseStepperStep>
            <BaseStepperStep
              label={
                gameType === ActivityCategoryType.Point ||
                gameType === ActivityCategoryType.Time
                  ? 'Easy Questions'
                  : 'Questions'
              }
            >
              {activityLevelComponent}
            </BaseStepperStep>
            {(gameType === ActivityCategoryType.Point ||
              gameType === ActivityCategoryType.Time) && (
              <BaseStepperStep label='Average Questions'>
                <ActivityUpsertFormStepPointTimeLevel categoryIndex={1} />
              </BaseStepperStep>
            )}
            {(gameType === ActivityCategoryType.Point ||
              gameType === ActivityCategoryType.Time) && (
              <BaseStepperStep label='Difficult Questions'>
                <ActivityUpsertFormStepPointTimeLevel categoryIndex={2} />
              </BaseStepperStep>
            )}
          </BaseStepper>
        </form>
      </FormProvider>
    </div>
  );
});
