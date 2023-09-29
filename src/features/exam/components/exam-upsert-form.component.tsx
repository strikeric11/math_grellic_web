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
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseStepper } from '#/base/components/base-stepper.component';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseStepperStep } from '#/base/components/base-stepper-step.component';
import { defaultQuestion } from '../helpers/exam-form.helper';
import { ExamUpsertFormStep1 } from './exam-upsert-form-step-1.component';
import { ExamUpsertFormStep2 } from './exam-upsert-form-step-2.component';
import { ExamUpsertFormStep3 } from './exam-upsert-form-step-3.component';

import type { FormProps, IconName } from '#/base/models/base.model';
import type { Exam, ExamUpsertFormData } from '../models/exam.model';

type Props = FormProps<'div', ExamUpsertFormData, Promise<Exam>>;

const EXAM_PREVIEW_PATH = `/${teacherBaseRoute}/${teacherRoutes.exam.to}/${teacherRoutes.exam.previewTo}`;
const EXAM_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.exam.to}`;

const choiceSchema = z.object({
  id: z.number().optional(),
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
  experience: z.number().optional(),
  choices: z.array(choiceSchema).min(2),
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
    coveredLessonIds: z.array(z.number()).optional(),
    randomizeQuestions: z.boolean(),
    visibleQuestionsCount: z
      .number({
        required_error: 'Visible questions is required',
        invalid_type_error: 'Visible questions is invalid',
      })
      .int()
      .gt(0, 'Visible questions should be greater than zero'),
    pointsPerQuestion: z
      .number()
      .int()
      .gt(0, 'Points per question should be greater than zero'),
    description: z.string().optional(),
    excerpt: z.string().optional(),
    status: z.nativeEnum(RecordStatus),
    questions: z.array(questionSchema).min(1),
    // Schedule
    startDate: z
      .date()
      .min(
        new Date(`${new Date().getFullYear()}-01-01`),
        'Start date is invalid',
      )
      .optional(),
    endDate: z
      .date()
      .min(new Date(`${new Date().getFullYear()}-01-01`), 'End date is invalid')
      .optional(),
    startTime: z
      .string()
      .refine((value) => isTime(value, { hourFormat: 'hour12' }), {
        message: 'Start time is invalid',
      })
      .optional(),
    endTime: z
      .string()
      .refine((value) => isTime(value, { hourFormat: 'hour12' }), {
        message: 'End time is invalid',
      })
      .optional(),
    studentIds: z.array(z.number()).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.visibleQuestionsCount > data.questions.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Visible questions is more than the total questions',
        path: ['visibleQuestionsCount'],
      });
    }

    data.questions.forEach((question, index) => {
      const isValid = question.choices.some((choice) => choice.isCorrect);
      if (!isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Pick an answer from the choices',
          path: [`questions.${index}.choices.0.text`],
        });
      }
    });

    if (
      data.startDate ||
      data.endDate ||
      data.startTime ||
      data.endTime ||
      data.studentIds !== undefined
    ) {
      if (!data.startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Start date is invalid',
          path: ['startDate'],
        });
      }

      if (!data.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End date is invalid',
          path: ['endDate'],
        });
      }

      if (!data.startTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Start time is invalid',
          path: ['startTime'],
        });
      }

      if (!data.endTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End time is invalid',
          path: ['endTime'],
        });
      }

      if (data.studentIds === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Assign students',
          path: ['studentIds'],
        });
      }
    }
  });

const defaultValues: Partial<ExamUpsertFormData> = {
  title: '',
  description: '',
  excerpt: '',
  coveredLessonIds: [],
  pointsPerQuestion: 1,
  status: RecordStatus.Draft,
  randomizeQuestions: false,
  orderNumber: null,
  visibleQuestionsCount: undefined,
  questions: [defaultQuestion],
  startDate: undefined,
  endDate: undefined,
  startTime: undefined,
  endTime: undefined,
  studentIds: undefined,
};

export const ExamUpsertForm = memo(function ({
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
  const setExamFormData = useBoundStore((state) => state.setExamFormData);

  const [isEdit, isEditPublished] = useMemo(
    () => [!!formData, formData?.status === RecordStatus.Published],
    [formData],
  );

  const methods = useForm<ExamUpsertFormData>({
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
    (errors: FieldErrors<ExamUpsertFormData>) => {
      let errorMessage = '';
      if (errors.questions?.length) {
        const targetQuestion = (errors.questions as any).filter(
          (q: any) => q,
        )[0];

        if (targetQuestion.choices?.length) {
          const targetChoice = targetQuestion.choices.filter((c: any) => c)[0];

          errorMessage = (Object.entries(targetChoice || {})[0][1] as any)
            .message;
        } else {
          errorMessage = (Object.entries(targetQuestion || {})[0][1] as any)
            .message;
        }
      } else {
        errorMessage = Object.entries(errors)[0][1]?.message || '';
      }

      toast.error(errorMessage || '');
    },
    [],
  );

  const submitForm = useCallback(
    async (data: ExamUpsertFormData, status?: RecordStatus) => {
      try {
        const targetData = status ? { ...data, status } : data;
        const exam = await onSubmit(targetData);

        toast.success(
          `${isEdit ? 'Updated' : 'Created'} ${exam.title} (No. ${
            exam.orderNumber
          })`,
        );

        onDone && onDone(true);
        navigate(EXAM_LIST_PATH);
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

    setExamFormData(getValues());
    window.open(EXAM_PREVIEW_PATH, '_blank')?.focus();
  }, [trigger, getValues, setExamFormData]);

  useEffect(() => {
    // Set lessonFormData to undefined when unmounting component
    return () => {
      setExamFormData();
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
            <BaseStepperStep label='Exam Info'>
              <ExamUpsertFormStep1 disabled={loading} />
            </BaseStepperStep>
            <BaseStepperStep label='Questions'>
              <ExamUpsertFormStep2 disabled={loading} />
            </BaseStepperStep>
            {(!isEdit || !isEditPublished) && (
              <BaseStepperStep label='Exam Schedule'>
                <ExamUpsertFormStep3 disabled={loading} />
              </BaseStepperStep>
            )}
          </BaseStepper>
        </form>
      </FormProvider>
    </div>
  );
});
