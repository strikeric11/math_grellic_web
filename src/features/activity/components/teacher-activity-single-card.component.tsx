import { memo, useCallback, useMemo } from 'react';
import { Menu } from '@headlessui/react';
import cx from 'classix';

import { convertSecondsToDuration } from '#/utils/time.util';
import { RecordStatus } from '#/core/models/core.model';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import {
  ActivityCategoryLevel,
  ActivityCategoryType,
  activityGameLabel,
  categoryLevel,
} from '../models/activity.model';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type {
  Activity,
  ActivityCategory,
  ActivityGame,
} from '../models/activity.model';

type Props = ComponentProps<typeof BaseSurface> & {
  activity: Activity;
  onDetails?: () => void;
  onPreview?: () => void;
  onEdit?: () => void;
};

const menuIconProps = { weight: 'bold', size: 48 } as ComponentProps<
  typeof BaseIconButton
>['iconProps'];

export const TeacherActivitySingleCard = memo(function ({
  className,
  activity,
  onDetails,
  onPreview,
  onEdit,
  ...moreProps
}: Props) {
  const [orderNumber, title, game, categories, isDraft] = useMemo(
    () => [
      activity.orderNumber,
      activity.title,
      activity.game,
      activity.categories,
      activity.status === RecordStatus.Draft,
    ],
    [activity],
  );

  const gameName = useMemo(
    () => activityGameLabel[game.name as ActivityGame],
    [game],
  );

  const isGameTypeStage = useMemo(
    () => game.type === ActivityCategoryType.Stage,
    [game],
  );

  const getCategoryValue = useCallback(
    (category: ActivityCategory) => {
      if (game.type === ActivityCategoryType.Point) {
        const durationText = convertSecondsToDuration(
          category.typePoint?.durationSeconds || 0,
          true,
        );
        return `${durationText}`;
      } else {
        const answerText =
          (category.typeTime?.correctAnswerCount || 0) > 1 ? 'Points' : 'Point';
        return `${category.typeTime?.correctAnswerCount} ${answerText}`;
      }
    },
    [game],
  );

  const getLevelIconName = useCallback(
    (level: ActivityCategoryLevel) => categoryLevel[level].iconName as IconName,
    [],
  );

  const getLevelName = useCallback(
    (level: ActivityCategoryLevel) => categoryLevel[level].levelName,
    [],
  );

  const generateStageText = useCallback((category: ActivityCategory) => {
    const totalStageCount = category.typeStage?.totalStageCount || 0;
    return `${totalStageCount} ${totalStageCount > 1 ? 'Levels' : 'Level'}`;
  }, []);

  const generateStagQuestionCountText = useCallback(
    (category: ActivityCategory) => {
      const visibleQuestionsCount = category.visibleQuestionsCount;
      return `${visibleQuestionsCount} ${
        visibleQuestionsCount > 1 ? 'Questions' : 'Question'
      }`;
    },
    [],
  );

  return (
    <BaseSurface
      className={cx(
        'pointer-events-none flex w-full items-center gap-5 !p-2.5 transition-all hover:cursor-pointer hover:!border-primary-hue-teal-focus hover:shadow-md hover:ring-1 hover:ring-primary-hue-teal-focus',
        className,
      )}
      rounded='sm'
      {...moreProps}
    >
      <div
        className='group pointer-events-auto flex h-full flex-1 items-center gap-4'
        tabIndex={0}
        onClick={onDetails}
      >
        <div className='flex h-full flex-1 items-start gap-4'>
          {/* TODO Image */}
          <div className='flex h-[88px] w-[121px] items-center justify-center overflow-hidden rounded border border-primary-hue-teal bg-primary-hue-teal/30 font-medium'>
            <BaseIcon name='game-controller' size={40} weight='light' />
          </div>
          <div className='flex h-full flex-1 flex-col justify-between gap-2 py-2'>
            {/* Info chips */}
            <div className='flex items-center gap-2.5'>
              <BaseChip iconName='game-controller'>
                Activity {orderNumber}
              </BaseChip>
              <BaseDivider className='!h-6' vertical />
              <BaseChip iconName='dice-three'>{gameName}</BaseChip>
              {isDraft && (
                <>
                  <BaseDivider className='!h-6' vertical />
                  <BaseChip iconName='file-dashed'>Draft</BaseChip>
                </>
              )}
            </div>
            {/* Title */}
            <h2 className='font-body text-lg font-medium tracking-normal text-accent group-hover:text-primary-hue-teal-focus'>
              {title}
            </h2>
          </div>
        </div>
        {/* Category info */}
        {!!categories.length && (
          <div className='flex min-w-[190px] flex-col'>
            {categories.map((category, index) => (
              <div key={`cat-${index}`} className='flex items-center gap-2.5'>
                {!isGameTypeStage ? (
                  <>
                    <BaseChip iconName={getLevelIconName(category.level)}>
                      {getCategoryValue(category)}
                    </BaseChip>
                    <span className='text-sm uppercase'>
                      ({getLevelName(category.level)})
                    </span>
                  </>
                ) : (
                  <div>
                    <BaseChip iconName='stack'>
                      {generateStageText(category)}
                    </BaseChip>
                    <BaseChip iconName='list-bullets'>
                      {generateStagQuestionCountText(category)}
                    </BaseChip>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className='pointer-events-auto relative h-12 w-7'>
        <BaseDropdownMenu
          customMenuButton={
            <div className='relative h-12 w-7'>
              <Menu.Button
                as={BaseIconButton}
                name='dots-three-vertical'
                variant='link'
                className='button absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
                iconProps={menuIconProps}
              />
            </div>
          }
        >
          <Menu.Item
            as={BaseDropdownButton}
            iconName='article'
            onClick={onDetails}
          >
            Details
          </Menu.Item>
          <Menu.Item
            as={BaseDropdownButton}
            iconName='file-text'
            onClick={onPreview}
          >
            Preview
          </Menu.Item>
          <BaseDivider className='my-1' />
          <Menu.Item as={BaseDropdownButton} iconName='pencil' onClick={onEdit}>
            Edit
          </Menu.Item>
        </BaseDropdownMenu>
      </div>
    </BaseSurface>
  );
});

export const TeacherActivitySingleCardSkeleton = memo(function () {
  return (
    <div className='flex min-h-[110px] w-full animate-pulse justify-between gap-x-4 rounded-lg bg-accent/20 py-2.5 pl-2.5 pr-4'>
      <div className='h-full w-[120px] rounded bg-accent/20' />
      <div className='flex h-full flex-1 flex-col justify-between gap-3 py-2.5'>
        <div className='h-6 w-[250px] rounded bg-accent/20' />
        <div className='h-6 w-[130px] rounded bg-accent/20' />
      </div>
      <div className='flex h-full gap-5'>
        <div className='flex flex-col justify-center gap-1.5'>
          <div className='h-6 w-48 rounded bg-accent/20' />
          <div className='h-6 w-48 rounded bg-accent/20' />
          <div className='h-6 w-48 rounded bg-accent/20' />
        </div>
        <div className='h-full w-5 rounded bg-accent/20' />
      </div>
    </div>
  );
});
