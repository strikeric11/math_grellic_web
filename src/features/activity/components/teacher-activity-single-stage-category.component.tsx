import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { TeacherActivitySingleQuestion } from './teacher-activity-single-question.component';

import type { ComponentProps } from 'react';
import type { ActivityCategory } from '../models/activity.model';

type Props = ComponentProps<'div'> & {
  category: ActivityCategory;
};

export const TeacherActivitySingleStageCategory = memo(function ({
  className,
  category,
  ...moreProps
}: Props) {
  const [questions, typeStage] = useMemo(
    () => [category.questions, category.typeStage],
    [category],
  );

  const stages = useMemo(
    () =>
      [...Array(typeStage?.totalStageCount || 0)].map((_, index) => {
        const stageNumber = index + 1;
        const targetQuestions = questions
          .filter((q) => q.stageNumber === stageNumber)
          .sort((qA, qB) => qA.orderNumber - qB.orderNumber);

        return {
          label: `Level ${stageNumber}`,
          questions: targetQuestions,
        };
      }),
    [typeStage, questions],
  );

  const generateStageQuestionCountText = useCallback(
    (count: number) => `${count} ${count > 1 ? 'Items' : 'Item'}`,
    [],
  );

  return (
    <div className={cx('mx-auto w-full', className)} {...moreProps}>
      {stages.map(({ label, questions }, index) => (
        <div className='flex flex-col gap-2.5'>
          <div className='flex items-center gap-2'>
            <BaseIcon name='stack' size={20} />
            <h3 className='text-base'>{label}</h3>
          </div>
          <div className='flex items-center gap-2.5 text-sm'>
            <BaseChip iconName='list-numbers'>
              {generateStageQuestionCountText(questions.length)}
            </BaseChip>
          </div>
          <div className='flex w-full flex-col gap-y-4'>
            {questions.map((question) => (
              <TeacherActivitySingleQuestion
                key={question.id}
                question={question}
              />
            ))}
          </div>
          {index < stages.length - 1 && (
            <div className='mb-2.5 mt-2'>
              <BaseDivider />
            </div>
          )}
        </div>
      ))}
    </div>
  );
});
