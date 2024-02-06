import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import cx from 'classix';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseControlledCheckbox } from '#/base/components/base-checkbox.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseImageCropper } from '#/base/components/base-image-cropper.component';
import { ActivityUpsertStageQuestionList } from './activity-upsert-stage-question-list.component';

import type { ComponentProps } from 'react';
import type { ActivityUpsertFormData } from '../models/activity-form-data.model';

type Props = ComponentProps<'div'> & {
  categoryIndex: number;
  disabled?: boolean;
};

const FIXED_FIELD_CLASSNAME = 'flex shrink-0 flex-col items-center gap-y-1';
const FIXED_FIELD_VALUE_CLASSNAME = 'text-2xl font-medium leading-none';

export const ActivityUpsertFormStepStageLevel = memo(function ({
  className,
  categoryIndex,
  disabled,
  ...moreProps
}: Props) {
  const exActImageEdit = useBoundStore((state) => state.exActImageEdit);
  const setExActImageEdit = useBoundStore((state) => state.setExActImageEdit);
  const { control, setValue } = useFormContext<ActivityUpsertFormData>();
  const [openImageCropModal, setOpenImageCropModal] = useState(false);

  const pointsPerQuestion = useWatch({
    control,
    name: `categories.${categoryIndex}.pointsPerQuestion`,
  });

  const stageQuestions = useWatch({
    control,
    name: `categories.${categoryIndex}.stageQuestions`,
  });

  const totalStageCount = useWatch({
    control,
    name: `categories.${categoryIndex}.totalStageCount`,
  });

  const totalQuestionCount = useMemo(
    () =>
      stageQuestions?.reduce(
        (total, stageQuestion) => total + stageQuestion.questions.length,
        0,
      ),
    [stageQuestions],
  );

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
      const { sIndex, index, cIndex } = exActImageEdit || {};

      if (index == null || sIndex == null) {
        return;
      }

      cIndex == null
        ? setValue(
            `categories.${categoryIndex}.stageQuestions.${sIndex}.questions.${index}.imageData`,
            data || undefined,
          )
        : setValue(
            `categories.${categoryIndex}.stageQuestions.${sIndex}.questions.${index}.choices.${cIndex}.imageData`,
            data || undefined,
          );

      handleSetOpenImageCropModal(false)();
    },
    [categoryIndex, exActImageEdit, handleSetOpenImageCropModal, setValue],
  );

  useEffect(() => {
    if (pointsPerQuestion != null) {
      return;
    }

    setValue(`categories.${categoryIndex}.pointsPerQuestion`, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!exActImageEdit) {
      return;
    }

    handleSetOpenImageCropModal(true)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exActImageEdit]);

  return (
    <>
      <div className={cx('w-full', className)} {...moreProps}>
        <fieldset
          className='group/field flex flex-wrap gap-5'
          disabled={disabled}
        >
          <BaseSurface
            className='flex w-full flex-col items-center justify-between gap-5 xs:flex-row'
            rounded='sm'
          >
            <BaseControlledCheckbox
              labelClassName='mt-0.5 !text-base'
              name={`categories.${categoryIndex}.randomizeQuestions`}
              label='Randomize Questions'
              control={control}
            />
            <div className='flex items-center gap-5'>
              <div className={FIXED_FIELD_CLASSNAME}>
                <span className={FIXED_FIELD_VALUE_CLASSNAME}>
                  {totalStageCount}
                </span>
                <small className='uppercase'>Total Levels</small>
              </div>
              <BaseDivider className='!h-10' vertical />
              <div className={FIXED_FIELD_CLASSNAME}>
                <span className={FIXED_FIELD_VALUE_CLASSNAME}>
                  {totalQuestionCount}
                </span>
                <small className='uppercase'>Total Questions</small>
              </div>
            </div>
          </BaseSurface>
          <ActivityUpsertStageQuestionList categoryIndex={0} />
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
