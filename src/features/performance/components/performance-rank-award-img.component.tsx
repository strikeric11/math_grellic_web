import { useMemo } from 'react';

import rankAward1 from '#/assets/images/rank-award-1.png';
import rankAward2 from '#/assets/images/rank-award-2.png';
import rankAward3 from '#/assets/images/rank-award-3.png';
import rankAward4 from '#/assets/images/rank-award-4.png';
import rankAward5 from '#/assets/images/rank-award-5.png';
import rankAward6 from '#/assets/images/rank-award-6.png';
import rankAward7 from '#/assets/images/rank-award-7.png';
import rankAward8 from '#/assets/images/rank-award-8.png';
import rankAward9 from '#/assets/images/rank-award-9.png';
import rankAward10 from '#/assets/images/rank-award-10.png';
import rankAward1Sm from '#/assets/images/rank-award-1-sm.png';
import rankAward2Sm from '#/assets/images/rank-award-2-sm.png';
import rankAward3Sm from '#/assets/images/rank-award-3-sm.png';
import rankAward4Sm from '#/assets/images/rank-award-4-sm.png';
import rankAward5Sm from '#/assets/images/rank-award-5-sm.png';
import rankAward6Sm from '#/assets/images/rank-award-6-sm.png';
import rankAward7Sm from '#/assets/images/rank-award-7-sm.png';
import rankAward8Sm from '#/assets/images/rank-award-8-sm.png';
import rankAward9Sm from '#/assets/images/rank-award-9-sm.png';
import rankAward10Sm from '#/assets/images/rank-award-10-sm.png';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'img'> & {
  rank: number;
  lg?: boolean;
};

const rankAwardSrc = [
  rankAward1,
  rankAward2,
  rankAward3,
  rankAward4,
  rankAward5,
  rankAward6,
  rankAward7,
  rankAward8,
  rankAward9,
  rankAward10,
];

const rankAwardSmSrc = [
  rankAward1Sm,
  rankAward2Sm,
  rankAward3Sm,
  rankAward4Sm,
  rankAward5Sm,
  rankAward6Sm,
  rankAward7Sm,
  rankAward8Sm,
  rankAward9Sm,
  rankAward10Sm,
];

export const PerformanceRankAwardImg = ({ rank, lg, ...moreProps }: Props) => {
  const src = useMemo(
    () => (lg ? rankAwardSrc[rank - 1] : rankAwardSmSrc[rank - 1]),
    [lg, rank],
  );

  const size = useMemo(() => {
    if (lg) {
      return { width: 106, height: 93 };
    }

    return { width: 42, height: 37 };
  }, [lg]);

  return <img src={src} {...size} {...moreProps} />;
};
