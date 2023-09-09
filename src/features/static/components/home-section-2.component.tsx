import { memo } from 'react';
import cx from 'classix';

import mathSymbolsPng from '#/assets/images/math-symbols.png';
import feat1Png from '#/assets/images/feat-1.png';
import feat2Png from '#/assets/images/feat-2.png';
import feat3Png from '#/assets/images/feat-3.png';
import homeContent from '../content/home-content.json';

import type { ComponentProps } from 'react';

const headerStyle = { backgroundImage: `url(${mathSymbolsPng})` };

const features = [
  {
    ...homeContent.section2.features[0],
    style: { backgroundImage: `url(${feat1Png})` },
    contentStyle: { width: '282px' },
  },
  {
    ...homeContent.section2.features[1],
    style: { backgroundImage: `url(${feat2Png})` },
    contentStyle: { width: '314px' },
  },
  {
    ...homeContent.section2.features[2],
    style: { backgroundImage: `url(${feat3Png})` },
    contentStyle: { width: '330px' },
  },
];

export const HomeSection2 = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'section'>) {
  return (
    <section
      className={cx('flex w-full flex-col items-center', className)}
      {...moreProps}
    >
      <div
        style={headerStyle}
        className='flex h-44 w-full items-end justify-center bg-[-30px_top] bg-repeat-x'
      >
        <h2 className='text-lg font-bold'>{homeContent.section2.title}</h2>
      </div>
      <div className='flex w-full max-w-[calc(40px+theme(maxWidth.static-full))] items-end justify-between px-4'>
        {features.map(({ key, title, content, contentStyle, style }) => (
          <div
            key={key}
            style={style}
            className='flex h-[500px] w-[410px] flex-col items-center justify-end bg-bottom bg-no-repeat pb-14'
          >
            <h3 className='mb-3.5 text-21px font-bold leading-none'>{title}</h3>
            <p style={contentStyle} className='text-lg'>
              {content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
});
