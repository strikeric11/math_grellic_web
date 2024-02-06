import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import cx from 'classix';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseControlledNumberInput } from '#/base/components/base-input.component';
import { BaseControlledCheckbox } from '#/base/components/base-checkbox.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseImageCropper } from '#/base/components/base-image-cropper.component';
import { ExamUpsertQuestionList } from './exam-upsert-question-list.component';

import type { ComponentProps } from 'react';
import type { ExamUpsertFormData } from '../models/exam-form-data.model';

type Props = ComponentProps<'div'> & {
  disabled?: boolean;
};

const FIXED_FIELD_CLASSNAME =
  'flex shrink-0 flex-col items-center gap-y-1 -3xs:w-auto w-full';
const FIXED_FIELD_VALUE_CLASSNAME = 'text-2xl font-medium leading-none';
const POINTS_LABEL_CLASSNAME =
  'inline-block text-center text-[13px] -3xs:text-xs uppercase xs:w-auto xs:text-[13px]';

const passingPointsWrapperProps = {
  className: 'w-full -3xs:w-auto -3xs:max-w-[203px]',
};

export const ExamUpsertFormStep2 = memo(function ({
  disabled,
  ...moreProps
}: Props) {
  const exActImageEdit = useBoundStore((state) => state.exActImageEdit);
  const setExActImageEdit = useBoundStore((state) => state.setExActImageEdit);
  const { control, setValue } = useFormContext<ExamUpsertFormData>();
  const [openImageCropModal, setOpenImageCropModal] = useState(false);

  const visibleQuestionsCount = useWatch({
    control,
    name: 'visibleQuestionsCount',
  });
  const pointsPerQuestion = useWatch({ control, name: 'pointsPerQuestion' });
  const questions = useWatch({ control, name: 'questions' });

  const totalQuestionCount = useMemo(() => questions?.length || 0, [questions]);

  const totalPoints = useMemo(() => {
    const value =
      visibleQuestionsCount == null
        ? totalQuestionCount
        : visibleQuestionsCount;
    const visibleCount = Math.max(0, Math.min(value, totalQuestionCount));

    return visibleCount * pointsPerQuestion;
  }, [visibleQuestionsCount, pointsPerQuestion, totalQuestionCount]);

  const handleSetOpenImageCropModal = useCallback(
    (isOpen: boolean) => () => {
      setOpenImageCropModal(isOpen);
      !isOpen &&
        setTimeout(() => {
          setExActImageEdit();
        }, 500);
    },
    [setExActImageEdit],
  );

  const handleImageCropComplete = useCallback(
    (data: string | null) => {
      const { index, cIndex } = exActImageEdit || {};

      if (index == null) {
        return;
      }

      cIndex == null
        ? setValue(`questions.${index}.imageData`, data || undefined)
        : setValue(
            `questions.${index}.choices.${cIndex}.imageData`,
            data || undefined,
          );

      handleSetOpenImageCropModal(false)();
    },
    [exActImageEdit, handleSetOpenImageCropModal, setValue],
  );

  useEffect(() => {
    if (!exActImageEdit) {
      return;
    }

    handleSetOpenImageCropModal(true)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exActImageEdit]);

  return (
    <>
      <div {...moreProps}>
        <fieldset
          className='group/field flex flex-wrap gap-5'
          disabled={disabled}
        >
          <BaseSurface
            className='flex w-full flex-wrap items-center justify-center gap-5 -3xs:flex-nowrap -3xs:justify-between'
            rounded='sm'
          >
            <div className={FIXED_FIELD_CLASSNAME}>
              <span className={FIXED_FIELD_VALUE_CLASSNAME}>
                {totalQuestionCount}
              </span>
              <small className={cx(POINTS_LABEL_CLASSNAME, '-3xs:w-[70px]')}>
                Total Questions
              </small>
            </div>
            <BaseIcon className='w-11 shrink-0 opacity-40' name='x' size={28} />
            <div className={FIXED_FIELD_CLASSNAME}>
              <span className={FIXED_FIELD_VALUE_CLASSNAME}>
                {pointsPerQuestion}
              </span>
              <small className={cx(POINTS_LABEL_CLASSNAME, '-3xs:w-16')}>
                Point Per Question
              </small>
            </div>
            <BaseIcon
              className='w-11 shrink-0 opacity-40'
              name='equals'
              size={32}
            />
            <div className={FIXED_FIELD_CLASSNAME}>
              <span className={FIXED_FIELD_VALUE_CLASSNAME}>{totalPoints}</span>
              <small className={cx(POINTS_LABEL_CLASSNAME, '-3xs:w-12')}>
                Total Points
              </small>
            </div>
          </BaseSurface>
          <BaseSurface
            className='flex w-full flex-col items-start justify-between gap-5 -3xs:flex-row -3xs:items-center'
            rounded='sm'
          >
            <BaseControlledNumberInput
              wrapperProps={passingPointsWrapperProps}
              label='Passing Points'
              name='passingPoints'
              control={control}
              fullWidth
              asterisk
            />
            <BaseControlledCheckbox
              labelClassName='mt-0.5 !text-base'
              name='randomizeQuestions'
              label='Randomize Questions'
              control={control}
            />
          </BaseSurface>
          <ExamUpsertQuestionList />
        </fieldset>
      </div>
      <BaseModal
        open={openImageCropModal}
        onClose={handleSetOpenImageCropModal(false)}
      >
        {!!exActImageEdit && (
          <BaseImageCropper
            imageData={exActImageEdit}
            onComplete={handleImageCropComplete}
          />
        )}
      </BaseModal>
    </>
  );
});
