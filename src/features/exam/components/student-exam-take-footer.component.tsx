import { memo, useCallback, useMemo, useState } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import cx from 'classix';

import { generateCountdownTime } from '#/utils/time.util';
import { options } from '#/utils/scrollbar.util';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseModal } from '#/base/components/base-modal.component';

import type { ComponentProps } from 'react';
import type { Duration } from 'dayjs/plugin/duration';
import type { ExamQuestion } from '../models/exam.model';
import type { ExamAnswerFormData } from '../models/exam-form-data.model';

type Props = Omit<ComponentProps<'div'>, 'onSubmit'> & {
  questions: ExamQuestion[];
  answers: ExamAnswerFormData[];
  ongoingDuration: Duration | null;
  loading?: boolean;
  submitDisabled?: boolean;
  preview?: boolean;
  onSubmit?: () => void;
};

type MiniAnswersProgressProps = ComponentProps<'div'> & {
  questions: ExamQuestion[];
  answers: ExamAnswerFormData[];
  isModal?: boolean;
  preview?: boolean;
  onItemClick?: () => void;
};

const MiniAnswersProgress = memo(function ({
  className,
  questions,
  answers,
  isModal,
  preview,
  onItemClick,
  ...moreProps
}: MiniAnswersProgressProps) {
  const miniAnswersProgress = useMemo(
    () =>
      questions.map(({ id, orderNumber }) => {
        const answer = answers
          .filter((a) => a)
          .find(
            ({ questionId }) => questionId === (preview ? orderNumber : id),
          );

        const onClick = () => {
          const element = document.getElementById(`q-${orderNumber}`);
          !!element && element.scrollIntoView({ behavior: 'smooth' });
          onItemClick && onItemClick();
        };

        return {
          hasAnswer: !!answer?.selectedQuestionChoiceId,
          onClick,
        };
      }),
    [questions, answers, preview, onItemClick],
  );

  return (
    <div
      className={cx(
        'w-full flex-wrap items-center overflow-hidden rounded-sm',
        isModal
          ? 'grid grid-cols-5 justify-center gap-1'
          : 'flex max-w-[414px] gap-0.5',
        className,
      )}
      {...moreProps}
    >
      {miniAnswersProgress.map(({ hasAnswer, onClick }, index) => (
        <button
          key={index}
          type='button'
          className={cx(
            'border border-accent/30 text-accent/80 transition-colors hover:bg-accent/20',
            hasAnswer ? '!bg-green-500' : 'bg-accent/30',
            isModal ? 'h-14 w-full' : 'h-6 w-6 text-xs',
          )}
          onClick={onClick}
        >
          {(index + 1).toString().padStart(2, '0')}
        </button>
      ))}
    </div>
  );
});

export const StudentExamTakeFooter = memo(function ({
  className,
  questions,
  answers,
  ongoingDuration,
  loading,
  submitDisabled,
  preview,
  onSubmit,
  ...moreProps
}: Props) {
  const [openModal, setOpenModal] = useState(false);

  const answerCount = useMemo(
    () => answers?.filter((a) => a && !!a.selectedQuestionChoiceId)?.length,
    [answers],
  );

  const questionCount = useMemo(() => questions?.length || 0, [questions]);

  const countdownTimer = useMemo(
    () => (preview ? '00:00' : generateCountdownTime(ongoingDuration)),
    [ongoingDuration, preview],
  );

  const isExpired = useMemo(
    () => ongoingDuration && ongoingDuration.asSeconds() <= 0,
    [ongoingDuration],
  );

  const handleSetModal = useCallback(
    (isOpen: boolean) => () => {
      setOpenModal(isOpen);
    },
    [],
  );

  return (
    <>
      <div
        className={cx(
          'bg-gradient sticky bottom-[48px] w-full bg-gradient-to-t from-backdrop from-60% to-transparent pb-3 pt-10 lg:bottom-0',
          className,
        )}
        {...moreProps}
      >
        <div className='flex w-full items-center justify-between'>
          <button
            type='button'
            className='flex h-8 w-8 items-center justify-center rounded-sm border border-accent/30 bg-accent/30 text-accent/80 transition-colors hover:bg-accent/20 xs:h-10 xs:w-11 -2lg:hidden'
            onClick={handleSetModal(true)}
          >
            <BaseIcon
              name='list-numbers'
              className='hidden xs:block'
              size={30}
            />
            <BaseIcon
              name='list-numbers'
              className='block xs:hidden'
              size={24}
            />
          </button>
          <MiniAnswersProgress
            className='hidden -2lg:flex'
            questions={questions}
            answers={answers}
            preview={preview}
          />
          <div className='flex items-center gap-x-4 font-medium text-primary'>
            <div className='hidden flex-col items-center xs:flex'>
              <span className='text-xl leading-none'>{answerCount}</span>
              <small className='uppercase opacity-80'>Answered Items</small>
            </div>
            <BaseDivider className='hidden !h-10 xs:block' vertical />
            <div className='hidden flex-col items-center xs:flex'>
              <span className='text-xl leading-none'>{questionCount}</span>
              <small className='uppercase opacity-80'>Total Items</small>
            </div>
            <BaseDivider className='hidden !h-10 xs:block' vertical />
            <div
              className={cx(
                'w-16 text-xl xs:w-[84px]',
                isExpired && 'animate-blink',
              )}
            >
              {countdownTimer}
            </div>
          </div>
        </div>
      </div>
      <BaseModal size='xs' open={openModal} onClose={handleSetModal(false)}>
        <OverlayScrollbarsComponent
          className='block h-full w-full -2lg:hidden'
          options={options}
          defer
        >
          <MiniAnswersProgress
            questions={questions}
            answers={answers}
            preview={preview}
            onItemClick={handleSetModal(false)}
            isModal
          />
          <div className='mt-5 flex w-full items-center justify-between gap-2.5 text-primary xs:hidden'>
            <div className='flex flex-col items-center'>
              <span className='text-xl leading-none'>{answerCount}</span>
              <small className='uppercase opacity-80'>Answered Items</small>
            </div>
            <div className='flex flex-col items-center'>
              <span className='text-xl leading-none'>{questionCount}</span>
              <small className='uppercase opacity-80'>Total Items</small>
            </div>
          </div>
          {!!onSubmit && (
            <BaseButton
              className='mt-10 block w-full xs:hidden'
              loading={loading}
              rightIconName='check-circle'
              disabled={submitDisabled}
              onClick={onSubmit}
            >
              Submit Exam
            </BaseButton>
          )}
        </OverlayScrollbarsComponent>
      </BaseModal>
    </>
  );
});
