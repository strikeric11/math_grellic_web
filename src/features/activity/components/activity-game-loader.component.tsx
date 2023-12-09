import { memo, useMemo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';
import { ActivityGame, type Activity } from '../models/activity.model';

type Props = ComponentProps<'div'> & {
  activity: Activity;
};

const gameSrc = {
  [ActivityGame.AngryBirds as string]: '/games/angry-birds/index.html',
  [ActivityGame.Basketball as string]: '/games/basketball/index.html',
  [ActivityGame.CarRacing as string]: '/games/car-racing/index.html',
  [ActivityGame.SlidePuzzle as string]: '/games/slide-puzzle/index.html',
};

export const ActivityGameLoader = memo(function ({
  className,
  activity,
  ...moreProps
}: Props) {
  const gameName = useMemo(() => activity.game.name, [activity]);

  return (
    <div
      className={cx(
        'w-full max-w-static-full overflow-hidden rounded-lg',
        className,
      )}
      {...moreProps}
    >
      {gameName && (
        <iframe className='aspect-video w-full' src={gameSrc[gameName]} />
      )}
    </div>
  );
});
