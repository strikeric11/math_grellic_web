import { memo } from 'react';
import DOMPurify from 'dompurify';
import cx from 'classix';

import { BaseLink } from '#/base/components/base-link.component';

import logoOnlyWithStudentPng from '#/assets/images/logo-only-with-student.png';
import homeContent from '../content/home-content.json';

import type { ComponentProps } from 'react';

const contentHtml = {
  __html: DOMPurify.sanitize(homeContent.section3.content),
};

export const HomeSection3 = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'section'>) {
  return (
    <section
      className={cx(
        '-2xl:items-start mx-auto flex w-full max-w-static-full flex-col items-center justify-between gap-5 px-4 lg:flex-row',
        className,
      )}
      {...moreProps}
    >
      <div className='-2xl:max-w-[435px] w-full max-w-xs'>
        <img
          src={logoOnlyWithStudentPng}
          alt='logo with student'
          width={435}
          height={421}
        />
      </div>
      <div className='flex w-full max-w-[702px] flex-col items-center'>
        <h2 className='mb-6 text-center text-3xl lg:text-32px'>
          {homeContent.section3.title}
        </h2>
        <div
          className='mb-5 text-justify text-lg'
          dangerouslySetInnerHTML={contentHtml}
        ></div>
        <BaseLink to='/about' rightIconName='arrow-circle-right'>
          Learn More
        </BaseLink>
      </div>
    </section>
  );
});
