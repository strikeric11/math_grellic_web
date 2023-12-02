import { memo, useCallback, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import cx from 'classix';

import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseControlledTextArea } from '#/base/components/base-textarea.component';
import { BaseTooltip } from '#/base/components/base-tooltip.component';
import { ActivityUpsertPointTimeQuestionChoiceList } from './activity-upsert-point-time-question-choice-list.component';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type { ActivityUpsertFormData } from '../models/activity-form-data.model';

type Props = ComponentProps<typeof BaseSurface> & {
  index: number;
  categoryIndex: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  moveUpDisabled?: boolean;
  moveDownDisabled?: boolean;
};

export const ActivityUpsertPointTimeQuestion = memo(function ({
  className,
  index,
  categoryIndex,
  onRemove,
  onMoveDown,
  onMoveUp,
  moveUpDisabled,
  moveDownDisabled,
  ...moreProps
}: Props) {
  const { control } = useFormContext<ActivityUpsertFormData>();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const orderNumber = useMemo(
    () => (index + 1).toString().padStart(2, '0'),
    [index],
  );

  const handleIsCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <BaseSurface
      className={cx('w-full !px-0 !pb-2.5 !pt-1', className)}
      rounded='sm'
      {...moreProps}
    >
      <div className='mb-2.5 flex w-full items-center justify-between border-b border-b-accent/20 px-5'>
        <span className='text-xl font-medium text-accent/50'>
          {orderNumber}
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
          <BaseControlledTextArea
            name={`categories.${categoryIndex}.questions.${index}.text`}
            placeholder='Question'
            control={control}
            fullWidth
          />
          <div className='flex h-input items-center justify-center'>
            <BaseIconButton
              name='x'
              variant='link'
              size='sm'
              onClick={onRemove}
            />
          </div>
        </div>
        <ActivityUpsertPointTimeQuestionChoiceList
          className='mt-4'
          categoryIndex={categoryIndex}
          questionIndex={index}
          isCollapsed={isCollapsed}
        />
      </div>
    </BaseSurface>
  );
});
