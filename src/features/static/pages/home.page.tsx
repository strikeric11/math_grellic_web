import { BaseStaticScene } from '#/base/components/base-static-scene.component';
import { HomeSection1 } from '../components/home-section-1.component';
import { HomeSection2 } from '../components/home-section-2.component';
import { HomeSection3 } from '../components/home-section-3.component';
import { HomeSection4 } from '../components/home-section-4.component';
import { HomeSection5 } from '../components/home-section-5.component';

export function HomePage() {
  return (
    <BaseStaticScene>
      <HomeSection1 className='pt-4 lg:pt-20' />
      <HomeSection2 className='mb-24 lg:mb-44' />
      <HomeSection3 className='mb-24 lg:mb-44' />
      <HomeSection4 className='mb-24 lg:mb-36' />
      <HomeSection5 />
    </BaseStaticScene>
  );
}
