import { memo } from 'react';
import cx from 'classix';

import iconBenefitFlexiblePng from '#/assets/images/icon-benefit-flexible.png';
import iconBenefitGamePng from '#/assets/images/icon-benefit-game.png';
import iconBenefitStarPng from '#/assets/images/icon-benefit-star.png';
import teacherWithSymbolsPng from '#/assets/images/illu-teacher-with-symbols.png';
import homeContent from '../content/home-content.json';

import type { ComponentProps } from 'react';

const benefits = [
  {
    ...homeContent.section4.benefits[0],
    src: iconBenefitStarPng,
  },
  {
    ...homeContent.section4.benefits[1],
    src: iconBenefitGamePng,
  },
  {
    ...homeContent.section4.benefits[2],
    src: iconBenefitFlexiblePng,
  },
];

export const HomeSection4 = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'section'>) {
  return (
    <section
      className={cx(
        'mx-auto flex w-full max-w-static-full items-start justify-between px-4',
        className,
      )}
      {...moreProps}
    >
      <div className='w-full max-w-[706px]'>
        <h2 className='mb-6'>{homeContent.section4.title}</h2>
        <div>
          {benefits.map(({ key, title, content, src }) => (
            <div key={key} className='mb-11 flex items-center last:mb-0'>
              <img
                src={src}
                alt={title}
                width={104}
                height={104}
                className='mr-4'
              />
              <div>
                <h3 className='mb-3.5 text-21px font-bold leading-none'>
                  {title}
                </h3>
                <p className='text-lg'>{content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='w-full max-w-[446px]'>
        <img
          src={teacherWithSymbolsPng}
          alt='teacher with symbols'
          width={446}
          height={528}
          className='translate-x-[18px]'
        />
      </div>
    </section>
  );
});
