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
        'mx-auto flex w-full max-w-static-full flex-col items-center justify-between px-4 lg:flex-row -2xl:items-start',
        className,
      )}
      {...moreProps}
    >
      <div className='w-full max-w-[706px]'>
        <h2 className='mx-auto mb-6 max-w-sm text-center text-3xl xs:max-w-full lg:text-left lg:text-32px'>
          {homeContent.section4.title}
        </h2>
        <div>
          {benefits.map(({ key, title, content, src }) => (
            <div
              key={key}
              className='mb-11 flex flex-col items-center last:mb-0 -2xs:flex-row'
            >
              <img
                src={src}
                alt={title}
                width={104}
                height={104}
                className='mb-5 -2xs:mb-0 -2xs:mr-4'
              />
              <div>
                <h3 className='mb-3.5 w-full text-center text-21px font-bold leading-none -2xs:text-start'>
                  {title}
                </h3>
                <p className='text-lg'>{content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='order-first w-full max-w-xs lg:order-none lg:max-w-sm -2xl:max-w-[446px]'>
        <img
          src={teacherWithSymbolsPng}
          alt='teacher with symbols'
          width={446}
          height={528}
          className='lg:translate-x-[18px]'
        />
      </div>
    </section>
  );
});
