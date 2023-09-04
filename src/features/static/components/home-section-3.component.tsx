import { memo } from 'react';
import cx from 'classix';

import { BaseLink } from '#/base/components/base-link.component';

import homeContent from '#/static/content/home-content.json';
import logoOnlyWithStudentPng from '#/assets/images/logo-only-with-student.png';

import type { ComponentProps } from 'react';

export const HomeSection3 = memo(function ({
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
      <div className='w-full max-w-[435px]'>
        <img
          src={logoOnlyWithStudentPng}
          alt='logo with student'
          width={435}
          height={421}
        />
      </div>
      <div className='flex w-full max-w-[702px] flex-col items-center'>
        <h2 className='mb-6'>{homeContent.section3.title}</h2>
        <div
          className='mb-5 text-justify text-lg'
          dangerouslySetInnerHTML={{ __html: homeContent.section3.content }}
        ></div>
        <BaseLink to='/about' rightIconName='arrow-circle-right'>
          Learn More
        </BaseLink>
      </div>
    </section>
  );
});
