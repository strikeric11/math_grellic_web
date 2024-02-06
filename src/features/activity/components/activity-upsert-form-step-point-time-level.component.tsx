import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import cx from 'classix';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseImageCropper } from '#/base/components/base-image-cropper.component';
import { BaseTooltip } from '#/base/components/base-tooltip.component';
import { BaseControlledNumberInput } from '#/base/components/base-input.component';
import { BaseControlledCheckbox } from '#/base/components/base-checkbox.component';
import { BaseControlledDurationInput } from '#/base/components/base-duration-input.component';
import { ActivityCategoryType } from '../models/activity.model';
import { ActivityUpsertPointTimeQuestionList } from './activity-upsert-point-time-question-list.component';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type { ActivityUpsertFormData } from '../models/activity-form-data.model';

type Props = ComponentProps<'div'> & {
  categoryIndex: number;
  disabled?: boolean;
};

const FIXED_FIELD_CLASSNAME =
  'flex shrink-0 flex-col items-center gap-y-1 w-full xs:w-auto';
const FIXED_FIELD_VALUE_CLASSNAME = 'text-2xl font-medium leading-none';
const POINTS_LABEL_CLASSNAME =
  'inline-block text-center text-[13px] w-auto xs:text-xs uppercase md:w-auto md:text-[13px]';

const durationWrapperProps = {
  className: 'w-full -2xs:w-auto -2xs:max-w-[280px]',
};

export const ActivityUpsertFormStepPointTimeLevel = memo(function ({
  className,
  categoryIndex,
  disabled,
  ...moreProps
}: Props) {
  const exActImageEdit = useBoundStore((state) => state.exActImageEdit);
  const setExActImageEdit = useBoundStore((state) => state.setExActImageEdit);
  const { control, setValue } = useFormContext<ActivityUpsertFormData>();
  const [openImageCropModal, setOpenImageCropModal] = useState(false);

  const game = useWatch({ control, name: 'game' });

  const visibleQuestionsCount = useWatch({
    control,
    name: `categories.${categoryIndex}.visibleQuestionsCount`,
  });

  const pointsPerQuestion = useWatch({
    control,
    name: `categories.${categoryIndex}.pointsPerQuestion`,
  });

  const questions = useWatch({
    control,
    name: `categories.${categoryIndex}.questions`,
  });

  const totalQuestionCount = useMemo(() => questions?.length || 0, [questions]);

  const totalPoints = useMemo(() => {
    const value =
      visibleQuestionsCount == null
        ? totalQuestionCount
        : visibleQuestionsCount;
    const visibleCount = Math.max(0, Math.min(value, totalQuestionCount));

    return visibleCount * (pointsPerQuestion || 0);
  }, [visibleQuestionsCount, pointsPerQuestion, totalQuestionCount]);

  const handleSetToMax = useCallback(() => {
    setValue(
      `categories.${categoryIndex}.correctAnswerCount`,
      totalQuestionCount,
    );
  }, [categoryIndex, totalQuestionCount, setValue]);

  const setToMaxButtonProps = useMemo(
    () => ({
      name: 'arrows-square-up' as IconName,
      isInput: true,
      tooltip: 'Set to max',
      iconProps: { size: 28 },
      onClick: handleSetToMax,
    }),
    [handleSetToMax],
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

      if (index == null || sIndex != null) {
        return;
      }

      cIndex == null
        ? setValue(
            `categories.${categoryIndex}.questions.${index}.imageData`,
            data || undefined,
          )
        : setValue(
            `categories.${categoryIndex}.questions.${index}.choices.${cIndex}.imageData`,
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

  if (!game?.type) {
    return (
      <div
        className={cx('flex w-full justify-center', className)}
        {...moreProps}
      >
        <span>No game selected</span>
      </div>
    );
  }

  return (
    <>
      <div className={cx('w-full', className)} {...moreProps}>
        <fieldset
          className='group/field flex flex-wrap gap-5'
          disabled={disabled}
        >
          <BaseSurface
            className='flex w-full flex-col items-center justify-center gap-5 xs:flex-row'
            rounded='sm'
          >
            {game?.type === ActivityCategoryType.Time && (
              <div className='flex items-center gap-x-4'>
                <BaseControlledNumberInput
                  label='Correct answer count'
                  name={`categories.${categoryIndex}.correctAnswerCount`}
                  control={control}
                  rightButtonProps={setToMaxButtonProps}
                  asterisk
                />
                <BaseTooltip content='Number of correct answers needed to finish the level'>
                  <BaseIcon name='question' size={30} />
                </BaseTooltip>
              </div>
            )}
            <div
              className={cx(
                FIXED_FIELD_CLASSNAME,
                game?.type === ActivityCategoryType.Time && 'flex-1',
              )}
            >
              <span className={FIXED_FIELD_VALUE_CLASSNAME}>
                {totalQuestionCount}
              </span>
              <small className={cx(POINTS_LABEL_CLASSNAME, 'xs:w-[70px]')}>
                Total Questions
              </small>
            </div>
            {game?.type === ActivityCategoryType.Point && (
              <>
                <BaseIcon
                  className='w-11 shrink-0 opacity-40'
                  name='x'
                  size={28}
                />
                <BaseControlledNumberInput
                  label='Points per Question'
                  name={`categories.${categoryIndex}.pointsPerQuestion`}
                  control={control}
                  asterisk
                />
                <BaseIcon
                  className='w-11 shrink-0 opacity-40'
                  name='equals'
                  size={32}
                />
                <div className={FIXED_FIELD_CLASSNAME}>
                  <span className={FIXED_FIELD_VALUE_CLASSNAME}>
                    {totalPoints}
                  </span>
                  <small className={cx(POINTS_LABEL_CLASSNAME, 'xs:w-12')}>
                    Total Points
                  </small>
                </div>
              </>
            )}
          </BaseSurface>
          <BaseSurface
            className='flex w-full flex-col items-start justify-between gap-5 -2xs:flex-row -2xs:items-center'
            rounded='sm'
          >
            {game?.type === ActivityCategoryType.Point && (
              <BaseControlledDurationInput
                wrapperProps={durationWrapperProps}
                label='Level Duration (hh:mm:ss)'
                name={`categories.${categoryIndex}.duration`}
                control={control}
                fullWidth
                asterisk
              />
            )}
            <BaseControlledCheckbox
              labelClassName='mt-0.5 !text-base inline-block w-auto xs:w-[155px]'
              name={`categories.${categoryIndex}.randomizeQuestions`}
              label='Randomize Questions'
              control={control}
            />
          </BaseSurface>
          <ActivityUpsertPointTimeQuestionList categoryIndex={categoryIndex} />
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
