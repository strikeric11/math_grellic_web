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
import { TeacherActivitySingleCategory } from './teacher-activity-single-category.component';

import type { ComponentProps } from 'react';
import type {
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
      <div className='mb-4 flex w-full items-center justify-between'>
        <div>
          <h2 className='pb-1 text-xl'>{title}</h2>
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
      <BaseDivider />
      <div className='my-4 flex w-full flex-col gap-y-3'>
        {/* Categories */}
        {categories.map((category) => (
          <TeacherActivitySingleCategory
            key={`cat-${category.id}`}
            gameType={game.type as ActivityCategoryType}
            category={category}
          />
        ))}
        <BaseDivider />
        <BaseSurface
          className='mx-auto w-full max-w-screen-sm px-4'
          rounded='sm'
        >
          <span className='block font-bold'>
            {descriptionHtml ? 'Description' : 'Activity has no description'}
          </span>
          {descriptionHtml && (
            <div
              className='base-rich-text rt-output'
              dangerouslySetInnerHTML={descriptionHtml}
            />
          )}
        </BaseSurface>
        <BaseSurface
          className='mx-auto w-full max-w-screen-sm px-4'
          rounded='sm'
        >
          <span className='block font-bold'>
            {excerpt ? 'Excerpt' : 'Activity has no excerpt'}
          </span>
          {excerpt}
        </BaseSurface>
      </div>
    </div>
  );
});

// id: number;
// level: ActivityCategoryLevel;
// randomizeQuestions: boolean;
// visibleQuestionsCount: number;
// questions: ActivityCategoryQuestion[];
// typePoint?: ActivityCategoryTypePoint;
// typeTime?: ActivityCategoryTypeTime;
// completions?: ActivityCategoryCompletion[];
