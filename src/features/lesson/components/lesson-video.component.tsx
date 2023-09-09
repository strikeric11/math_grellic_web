import { memo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  url: string;
  title?: string;
};

export const LessonVideo = memo(function ({
  className,
  url,
  title,
  ...moreProps
}: Props) {
  const videoSrc = `${url}?rel=0&modestbranding=1`;

  return (
    <div
      className={cx(
        'h-[500px] w-full overflow-hidden rounded-lg bg-black',
        className,
      )}
      {...moreProps}
    >
      <iframe
        className='mx-auto h-full w-full max-w-static-full'
        src={videoSrc}
        allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        title={title || 'Lesson Video'}
        allowFullScreen
      />
    </div>
  );
});
