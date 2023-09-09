import { memo } from 'react';
import cx from 'classix';

import iconKeyExamPng from '#/assets/images/icon-key-exam.png';
import iconKeyExercisePng from '#/assets/images/icon-key-exercise.png';
import iconKeyFeedbackPng from '#/assets/images/icon-key-feedback.png';
import iconKeyLessonPng from '#/assets/images/icon-key-lesson.png';
import iconKeyRewardPng from '#/assets/images/icon-key-reward.png';
import iconKeyStatisticsPng from '#/assets/images/icon-key-statistics.png';
import homeContent from '../content/home-content.json';

import type { ComponentProps } from 'react';

const keyFeatures = [
  {
    ...homeContent.section5.keyFeatures[0],
    src: iconKeyLessonPng,
  },
  {
    ...homeContent.section5.keyFeatures[1],
    src: iconKeyExercisePng,
  },
  {
    ...homeContent.section5.keyFeatures[2],
    src: iconKeyExamPng,
  },
  {
    ...homeContent.section5.keyFeatures[3],
    src: iconKeyFeedbackPng,
  },
  {
    ...homeContent.section5.keyFeatures[4],
    src: iconKeyStatisticsPng,
  },
  {
    ...homeContent.section5.keyFeatures[5],
    src: iconKeyRewardPng,
  },
];

export const HomeSection5 = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'section'>) {
  return (
    <section
      className={cx(
        'mx-auto flex w-full max-w-static-full flex-col items-center px-4',
        className,
      )}
      {...moreProps}
    >
      <h2 className='mb-7'>{homeContent.section5.title}</h2>
      <div className='flex flex-col flex-wrap items-center justify-start xl:flex-row xl:items-start xl:justify-between'>
        {keyFeatures.map(({ key, title, content, src }) => (
          <div
            key={key}
            className='mb-12 flex max-w-[577px] flex-col items-center'
          >
            <img
              src={src}
              alt={title}
              width={130}
              height={88}
              className='mb-5'
            />
            <div className='flex flex-col items-center'>
              <h3 className='mb-5 text-center text-21px font-bold leading-none'>
                {title}
              </h3>
              <p className='text-justify text-lg'>{content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});
