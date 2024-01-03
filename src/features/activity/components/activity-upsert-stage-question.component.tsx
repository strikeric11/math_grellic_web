import { memo, useCallback, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import cx from 'classix';

import { ExActTextType } from '#/core/models/core.model';
import { BaseControlledInput } from '#/base/components/base-input.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseControlledTextArea } from '#/base/components/base-textarea.component';
import { BaseTooltip } from '#/base/components/base-tooltip.component';
import { BaseImageUploader } from '#/base/components/base-image-uploader.component';
import { ActivityGame } from '../models/activity.model';
import { ActivityUpsertStageQuestionChoiceList } from './activity-upsert-stage-question-choice-list.component';

import type { ChangeEvent, ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type { ActivityUpsertFormData } from '../models/activity-form-data.model';

type Props = ComponentProps<typeof BaseSurface> & {
  index: number;
  categoryIndex: number;
  stageIndex: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUploadChange: (file: any) => void;
  moveUpDisabled?: boolean;
  moveDownDisabled?: boolean;
};

export const ActivityUpsertStageQuestion = memo(function ({
  className,
  index,
  categoryIndex,
  stageIndex,
  onRemove,
  onMoveDown,
  onMoveUp,
  onUploadChange,
  moveUpDisabled,
  moveDownDisabled,
  ...moreProps
}: Props) {
  const { control, setValue, formState } =
    useFormContext<ActivityUpsertFormData>();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const gameName = useWatch({ control, name: 'game.name' });

  const textType = useWatch({
    control,
    name: `categories.${categoryIndex}.stageQuestions.${stageIndex}.questions.${index}.textType`,
  });

  const imageData = useWatch({
    control,
    name: `categories.${categoryIndex}.stageQuestions.${stageIndex}.questions.${index}.imageData`,
  });

  const questionTextTypeIconName = useMemo(
    () => (textType !== ExActTextType.Text ? 'text-t' : 'image-square'),
    [textType],
  );

  const stageNumber = useMemo(
    () => (stageIndex + 1).toString().padStart(2, '0'),
    [stageIndex],
  );

  const orderNumber = useMemo(
    () => (index + 1).toString().padStart(2, '0'),
    [index],
  );

  const errorMessage = useMemo(() => {
    try {
      const errorStageQuestion = (formState.errors.categories as any)[
        categoryIndex
      ]?.stageQuestions[stageIndex];

      if (!errorStageQuestion) {
        return undefined;
      }

      return (
        errorStageQuestion.questions &&
        errorStageQuestion.questions[index]?.imageData?.message
      );
    } catch (error) {
      return null;
    }
  }, [formState, index, stageIndex, categoryIndex]);

  const textTypeTooltipText = useMemo(() => {
    if (textType === ExActTextType.Text) {
      return 'Switch to image input';
    } else {
      return 'Switch to text input';
    }
  }, [textType]);

  const handleIsCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const setTextType = useCallback(() => {
    const value =
      textType === ExActTextType.Text
        ? ExActTextType.Image
        : ExActTextType.Text;

    setValue(
      `categories.${categoryIndex}.stageQuestions.${stageIndex}.questions.${index}.textType`,
      value,
    );
  }, [index, stageIndex, categoryIndex, textType, setValue]);

  const handleUploadChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;

      if (!files?.length || !onUploadChange) {
        return;
      }

      onUploadChange(files[0]);
    },
    [onUploadChange],
  );

  const handleImageRemove = useCallback(() => {
    setValue(
      `categories.${categoryIndex}.stageQuestions.${stageIndex}.questions.${index}.imageData`,
      undefined,
    );
  }, [index, stageIndex, categoryIndex, setValue]);

  return (
    <BaseSurface
      className={cx('w-full !px-0 !pb-2.5 !pt-1', className)}
      rounded='sm'
      {...moreProps}
    >
      <div className='mb-2.5 flex w-full items-center justify-between border-b border-b-accent/20 px-5'>
        <span className='text-xl font-medium text-accent/50'>
          <span className='text-base'>{stageNumber}</span>.{orderNumber}
        </span>
        <div className='flex items-center'>
          <BaseTooltip content='Move Up'>
            <BaseIconButton
              name='arrow-circle-up'
              variant='link'
              className='!w-8'
              disabled={moveUpDisabled}
              onClick={onMoveUp}
            />
          </BaseTooltip>
          <BaseTooltip content='Move Down'>
            <BaseIconButton
              name='arrow-circle-down'
              variant='link'
              className='!w-8'
              disabled={moveDownDisabled}
              onClick={onMoveDown}
            />
          </BaseTooltip>
        </div>
      </div>
      <div className='px-2.5'>
        <div className='flex items-start gap-x-2.5'>
          <div className='flex h-input items-center justify-center'>
            <BaseIconButton
              name={(isCollapsed ? 'caret-right' : 'caret-down') as IconName}
              variant='link'
              size='sm'
              onClick={handleIsCollapsed}
            />
          </div>
          <div className='relative w-full'>
            {textType === ExActTextType.Text ? (
              <BaseControlledTextArea
                name={`categories.${categoryIndex}.stageQuestions.${stageIndex}.questions.${index}.text`}
                placeholder='Question'
                control={control}
                fullWidth
              />
            ) : (
              <BaseImageUploader
                name={`categories.${categoryIndex}.stageQuestions.${stageIndex}.questions.${index}.imageData`}
                value={imageData}
                errorMessage={errorMessage}
                onChange={handleUploadChange}
                onRemove={handleImageRemove}
                fullWidth
              />
            )}
            <div className='absolute right-3.5 top-3 z-20'>
              <BaseTooltip content={textTypeTooltipText}>
                <BaseIconButton
                  name={questionTextTypeIconName}
                  variant='link'
                  size='xs'
                  className='!text-accent hover:!text-primary'
                  onClick={setTextType}
                />
              </BaseTooltip>
            </div>
          </div>
          <div className='flex h-input items-center justify-center'>
            <BaseIconButton
              name='x'
              variant='link'
              size='sm'
              onClick={onRemove}
            />
          </div>
        </div>
        {gameName === ActivityGame.EscapeRoom && (
          <div className='mt-2.5 px-[50px]'>
            <BaseControlledInput
              name={`categories.${categoryIndex}.stageQuestions.${stageIndex}.questions.${index}.hintText`}
              placeholder='Hint'
              control={control}
              fullWidth
            />
          </div>
        )}
        <ActivityUpsertStageQuestionChoiceList
          className='mt-4'
          categoryIndex={categoryIndex}
          stageIndex={stageIndex}
          questionIndex={index}
          isCollapsed={isCollapsed}
        />
      </div>
    </BaseSurface>
  );
});
