import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebounce } from '@uidotdev/usehooks';
import toast from 'react-hot-toast';
import z from 'zod';
import cx from 'classix';

import { BaseButton } from '#/base/components/base-button.components';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { StudentExamTakeQuestion } from './student-exam-take-question.component';
import { StudentExamTakeFooter } from './student-exam-take-footer.component';

import type { MouseEvent } from 'react';
import type { Duration } from 'dayjs/plugin/duration';
import type { FormProps } from '#/base/models/base.model';
import type { StudentExamFormData } from '../models/exam-form-data.model';
import type { Exam, ExamCompletion, ExamQuestion } from '../models/exam.model';

type Props = FormProps<
  'div',
  StudentExamFormData,
  Promise<ExamCompletion | null>
> & {
  exam: Exam;
  ongoingDuration: Duration | null;
  isExpired?: boolean;
  preview?: boolean;
  onSyncAnswers?: (data: StudentExamFormData) => Promise<ExamCompletion>;
};

const answerSchema = z.object({
  questionId: z.number().positive(),
  selectedQuestionChoiceId: z.number().positive().optional(),
});

const schema = z.object({
  id: z.number().positive(),
  scheduleId: z.number().positive(),
  answers: z.array(answerSchema.optional()),
});

const defaultValues: Partial<StudentExamFormData> = {
  id: 0,
  scheduleId: 0,
  answers: [],
};

export const StudentExamTakeForm = memo(function ({
  className,
  loading: formLoading,
  isExpired,
  isDone,
  exam,
  formData,
  preview,
  ongoingDuration,
  onDone,
  onSubmit,
  onSyncAnswers,
  ...moreProps
}: Props) {
  const {
    formState: { isSubmitting },
    control,
    handleSubmit,
    setValue,
    getValues,
  } = useForm<StudentExamFormData>({
    shouldFocusError: false,
    defaultValues: formData || defaultValues,
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    setValue('id', exam.id);

    if (preview) {
      setValue('scheduleId', 1);
      return;
    }

    if (exam?.schedules?.length) {
      setValue('scheduleId', exam.schedules[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam]);

  const [openModal, setOpenModal] = useState(false);

  const answers = useWatch({ control, name: 'answers' });

  const questions = useMemo(() => {
    if (!formData || !formData.answers.length) {
      return exam.questions;
    }

    return formData.answers.map((a) => {
      const question = exam.questions.find((q) => q.id === a.questionId);
      return question;
    }) as ExamQuestion[];
  }, [exam, formData]);

  const questionCount = useMemo(() => questions?.length || 0, [questions]);

  const answerCount = useMemo(
    () => answers?.filter((a) => a && !!a.selectedQuestionChoiceId)?.length,
    [answers],
  );

  const unansweredCountText = useMemo(() => {
    const unansweredCount = questionCount - answerCount;

    if (!unansweredCount) {
      return null;
    }

    const itemText = unansweredCount > 1 ? 'items' : 'item';
    return `${unansweredCount} unanswered ${itemText}`;
  }, [questionCount, answerCount]);

  const debouncedAnswers = useDebounce(answers, 3000);

  // Prevent right click
  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault();
  }, []);

  const handleSetModal = useCallback(
    (isOpen: boolean) => () => {
      if (formLoading || isSubmitting) {
        return;
      }
      setOpenModal(isOpen);
    },
    [formLoading, isSubmitting],
  );

  const submitForm = useCallback(
    async (data: StudentExamFormData) => {
      try {
        // Filter data, remove undefined values from array
        const targetData = { ...data, answers: data.answers.filter((a) => a) };
        await onSubmit(targetData);

        toast.success('Exam submitted, please wait...');

        onDone && onDone(true);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [onSubmit, onDone],
  );

  useEffect(() => {
    if (!onSyncAnswers) {
      return;
    }

    (async () => {
      await onSyncAnswers(getValues());
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAnswers]);

  return (
    <>
      <div
        className={cx('flex h-full w-full flex-col', className)}
        onContextMenu={handleContextMenu}
        {...moreProps}
      >
        <form className='flex w-full flex-1 flex-col justify-between'>
          <div className='mx-auto flex w-full max-w-screen-sm flex-col gap-y-4'>
            {questions.map((question, index) => (
              <StudentExamTakeQuestion
                key={`q-${question.orderNumber}`}
                isExpired={isExpired}
                question={question}
                name={`answers.${index}`}
                control={control}
                preview={preview}
              />
            ))}
            <BaseButton
              className='my-2.5 w-full'
              loading={isSubmitting || formLoading}
              rightIconName='check-circle'
              disabled={isDone}
              onClick={handleSetModal(true)}
            >
              Submit Exam
            </BaseButton>
          </div>
          <StudentExamTakeFooter
            className='relative z-20'
            loading={isSubmitting || formLoading}
            submitDisabled={isDone}
            questions={questions}
            answers={answers}
            ongoingDuration={ongoingDuration}
            preview={preview}
            onSubmit={handleSetModal(true)}
          />
        </form>
      </div>
      <BaseModal
        size='xs'
        open={openModal}
        onClose={handleSetModal(false)}
        onContextMenu={handleContextMenu}
      >
        <div>
          <div className='mb-4 mt-2.5 flex w-full items-center justify-center gap-x-4 border-y border-accent/20 bg-white py-2.5 font-medium text-primary'>
            <div className='flex flex-col items-center'>
              <span className='text-xl leading-none'>{answerCount}</span>
              <small className='text-center uppercase'>Answered Items</small>
            </div>
            <BaseDivider className='!h-10' vertical />
            <div className='flex flex-col items-center'>
              <span className='text-xl leading-none'>{questionCount}</span>
              <small className='text-center uppercase'>Total Items</small>
            </div>
          </div>
          {!!unansweredCountText && (
            <p className='pb-4'>
              You still have{' '}
              <span className='font-medium'>{unansweredCountText}</span>.
              Proceed exam submission?
            </p>
          )}
          <BaseButton
            className='!w-full'
            loading={isSubmitting || formLoading}
            rightIconName='check-circle'
            onClick={handleSubmit(submitForm, (errors) => {
              console.log(errors);
            })}
          >
            Confirm
          </BaseButton>
        </div>
      </BaseModal>
    </>
  );
});
