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
    contentStyle: { maxWidth: '282px' },
  },
  {
    ...homeContent.section2.features[1],
    style: { backgroundImage: `url(${feat2Png})` },
    contentStyle: { maxWidth: '314px' },
  },
  {
    ...homeContent.section2.features[2],
    style: { backgroundImage: `url(${feat3Png})` },
    contentStyle: { maxWidth: '330px' },
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
        <h2 className='mb-3.5 max-w-md px-2.5 text-center text-lg font-bold xs:px-0 md:max-w-none'>
          {homeContent.section2.title}
        </h2>
      </div>
      <div className='-2xl:flex-row -2xl:justify-between -2xl:items-end flex w-full max-w-[calc(40px+theme(maxWidth.static-full))] flex-col items-center justify-start px-4'>
        {features.map(({ key, title, content, contentStyle, style }) => (
          <div
            key={key}
            style={style}
            className='flex h-[500px] w-full flex-col items-center justify-end bg-bottom bg-no-repeat pb-14 xs:w-[410px]'
          >
            <h3 className='mb-3.5 text-center text-21px font-bold leading-none'>
              {title}
            </h3>
            <p style={contentStyle} className='text-lg'>
              {content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
});
