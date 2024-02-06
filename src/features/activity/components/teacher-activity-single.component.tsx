import { memo, useMemo } from 'react';
import DOMPurify from 'dompurify';
import cx from 'classix';

import { teacherRoutes } from '#/app/routes/teacher-routes';
import { RecordStatus } from '#/core/models/core.model';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { activityGameLabel } from '../models/activity.model';
import { TeacherActivitySinglePointTimeCategory } from './teacher-activity-single-point-time-category.component';
import { TeacherActivitySingleStageCategory } from './teacher-activity-single-stage-category.component';

import type { ComponentProps } from 'react';
import {
  Activity,
  ActivityCategoryType,
  ActivityGame,
} from '../models/activity.model';

type Props = ComponentProps<'div'> & {
  activity: Activity;
};

export const TeacherActivitySingle = memo(function ({
  className,
  activity,
  ...moreProps
}: Props) {
  const [title, orderNumber, game, categories, isDraft, excerpt] = useMemo(
    () => [
      activity.title,
      activity.orderNumber,
      activity.game,
      activity.categories,
      activity.status === RecordStatus.Draft,
      activity.excerpt,
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

  const totalStageCountText = useMemo(() => {
    const totalStageCount = categories[0].typeStage?.totalStageCount || 0;
    return `${totalStageCount} ${totalStageCount > 1 ? 'Levels' : 'Level'}`;
  }, [categories]);

  const totalQuestionCounText = useMemo(() => {
    const visibleQuestionsCount = categories[0].visibleQuestionsCount;
    return `${visibleQuestionsCount} ${
      visibleQuestionsCount > 1 ? 'Questions' : 'Question'
    }`;
  }, [categories]);

  const descriptionHtml = useMemo(() => {
    const isEmpty = !DOMPurify.sanitize(activity.description || '', {
      ALLOWED_TAGS: [],
    }).trim();

    return !isEmpty
      ? {
          __html: DOMPurify.sanitize(activity.description || ''),
        }
      : null;
  }, [activity]);

  return (
    <div className={cx('w-full pb-16', className)} {...moreProps}>
      <div className='mb-2.5 flex w-full flex-col flex-wrap items-start justify-between gap-2.5 -3xs:flex-row -2lg:flex-nowrap -2lg:items-center'>
        <div>
          <h2 className='pb-1 text-xl'>{title}</h2>
          <div className='flex flex-col items-start gap-1 -2lg:flex-row -2lg:items-center -2lg:gap-2.5'>
            <BaseChip iconName='game-controller'>
              Activity {orderNumber}
            </BaseChip>
            <BaseDivider className='hidden !h-6 -2lg:block' vertical />
            <BaseChip iconName='dice-three'>{gameName}</BaseChip>
            {isGameTypeStage && (
              <>
                <BaseDivider className='hidden !h-6 -2lg:block' vertical />
                <BaseChip iconName='stack'>{totalStageCountText}</BaseChip>
                <BaseDivider className='hidden !h-6 -2lg:block' vertical />
                <BaseChip iconName='list-bullets'>
                  {totalQuestionCounText}
                </BaseChip>
              </>
            )}
            {isDraft && (
              <>
                <BaseDivider className='hidden !h-6 -2lg:block' vertical />
                <BaseChip iconName='file-dashed'>Draft</BaseChip>
              </>
            )}
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <BaseLink
            to={teacherRoutes.activity.previewTo}
            className='!px-3'
            variant='solid'
            target='_blank'
          >
            <BaseIcon name='file-text' size={24} />
          </BaseLink>
          <BaseLink
            to={teacherRoutes.activity.editTo}
            className='!px-3'
            variant='solid'
          >
            <BaseIcon name='pencil' size={24} />
          </BaseLink>
        </div>
      </div>
      <BaseDivider className='mb-2.5' />
      <BaseSurface className='flex flex-col gap-2.5' rounded='sm'>
        <div className='flex flex-col items-start gap-2.5 md:flex-row md:gap-0'>
          <div className='mr-4 flex-1 border-0 border-accent/20 md:border-r'>
            <h3 className='text-base'>
              {descriptionHtml ? 'Description' : 'Activity has no description'}
            </h3>
            {descriptionHtml && (
              <div
                className='base-rich-text rt-output'
                dangerouslySetInnerHTML={descriptionHtml}
              />
            )}
          </div>
          <BaseDivider className='block md:hidden' />
          <div className='flex-1'>
            <h3 className='text-base'>
              {excerpt ? 'Excerpt' : 'Activity has no excerpt'}
            </h3>
            <p className='my-2'>{excerpt}</p>
          </div>
        </div>
        <BaseDivider className='mb-1.5' />
        {/* Categories */}
        {!isGameTypeStage
          ? categories.map((category) => (
              <TeacherActivitySinglePointTimeCategory
                key={`cat-${category.id}`}
                className='mb-4 border-b border-accent/20 pb-4 last:mb-0 last:border-none last:pb-0'
                gameType={game.type as ActivityCategoryType}
                category={category}
              />
            ))
          : categories.map((category) => (
              <TeacherActivitySingleStageCategory
                key={`cat-${category.id}`}
                className='mb-4 border-b border-accent/20 pb-4 last:mb-0 last:border-none last:pb-0'
                gameName={game.name as ActivityGame}
                category={category}
              />
            ))}
      </BaseSurface>
    </div>
  );
});
