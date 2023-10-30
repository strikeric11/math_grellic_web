import { useMemo } from 'react';

import { UserGender } from '../models/user.model';

import userAvatarMalePng from '#/assets/images/user-avatar-male.png';
import userAvatarFemalePng from '#/assets/images/user-avatar-female.png';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  gender: UserGender;
  size?: 'base' | 'lg';
};

export const UserAvatarImg = ({
  gender,
  size = 'base',
  ...moreProps
}: Props) => {
  const src = useMemo(
    () =>
      gender === UserGender.Female ? userAvatarFemalePng : userAvatarMalePng,
    [gender],
  );

  const imgSize = useMemo(() => (size === 'base' ? 63 : 80), [size]);

  return (
    <div
      className='flex items-center justify-center overflow-hidden rounded bg-accent'
      {...moreProps}
    >
      <img src={src} alt='avatar' width={imgSize} height={imgSize} />
    </div>
  );
};
