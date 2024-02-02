import DOMPurify from 'dompurify';

import { BaseStaticScene } from '#/base/components/base-static-scene.component';

import logoOnlyPng from '#/assets/images/logo-only.png';
import mgProfilePicPng from '#/assets/images/mg-profile-pic.png';
import mathSymbolsPng from '#/assets/images/math-symbols.png';
import aboutContent from '../content/about-content.json';

const headerStyle = { backgroundImage: `url(${mathSymbolsPng})` };

const section1ContentHtml = {
  __html: DOMPurify.sanitize(aboutContent.section1.content),
};

const section2ContentHtml = {
  __html: DOMPurify.sanitize(aboutContent.section2.content),
};

export function AboutPage() {
  return (
    <BaseStaticScene title='About Us'>
      <section className='-2xl:items-start mx-auto mb-24 flex w-full max-w-static-full flex-col items-center justify-between gap-5 px-4 lg:mb-56 lg:flex-row'>
        <div className='-2xl:max-w-[432px] flex w-full max-w-[240px] justify-center sm:max-w-xs'>
          <img src={logoOnlyPng} alt='logo only' width={370} height={358} />
        </div>
        <div className='flex w-full max-w-[702px] flex-col items-center'>
          <h2 className='mb-6 w-full text-center leading-none'>
            {aboutContent.section1.title}
          </h2>
          <div
            className='text-justify text-lg'
            dangerouslySetInnerHTML={section1ContentHtml}
          ></div>
        </div>
      </section>
      <section className='flex w-full flex-col items-center'>
        <div
          style={headerStyle}
          className='relative z-10 flex w-full flex-col items-center bg-[center_16px] bg-repeat-x'
        >
          <img
            src={mgProfilePicPng}
            alt='myrhelle grecia profile'
            width={281}
            height={331}
            className='mb-5'
          />
          <h2 className='leading-none'>{aboutContent.section2.header.name}</h2>
          <span className='font-display text-21px font-bold leading-tight text-primary'>
            {aboutContent.section2.header.title}
          </span>
        </div>
        <div className='-mt-[170px] flex w-full flex-col items-center bg-backdrop-light pb-20 pt-48'>
          <div
            className='w-full max-w-[800px] px-4 text-justify text-lg lg:px-0'
            dangerouslySetInnerHTML={section2ContentHtml}
          />
        </div>
      </section>
    </BaseStaticScene>
  );
}
