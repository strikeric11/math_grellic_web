import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';

import type { ComponentProps } from 'react';
import type { Announcement } from '../models/announcement.model';

type Props = Omit<ComponentProps<'div'>, 'onClick'> & {
  announcement: Announcement | null;
  upcoming?: boolean;
  fullSize?: boolean;
  loading?: boolean;
  onClick?: (announcement: Announcement) => void;
};

export const AnnouncementCard = memo(function ({
  className,
  announcement,
  upcoming,
  fullSize,
  loading,
  onClick,
  ...moreProps
}: Props) {
  const [title, description, startDate] = useMemo(
    () => [
      announcement?.title,
      announcement?.description,
      announcement?.startDate,
    ],
    [announcement],
  );

  const dateText = useMemo(
    () => dayjs(startDate).format('MMM DD, YYYY / h:mm A').toUpperCase(),
    [startDate],
  );

  const wrapperClassName = useMemo(() => {
    if (!announcement) {
      return ['items-center justify-center border-accent/30'];
    }

    return [
      !upcoming ? 'border-primary' : 'border-green-600',
      onClick && 'cursor-pointer transition-colors',
      onClick && !upcoming && 'hover:border-primary-focus-light',
      onClick && upcoming && 'hover:border-green-500',
    ];
  }, [announcement, upcoming, onClick]);

  const iconClassName = useMemo(() => {
    if (!announcement) {
      return ['text-accent/30'];
    }

    return [
      upcoming ? 'text-green-600' : 'text-primary',
      onClick &&
        !upcoming &&
        'group-hover/announcement:text-primary-focus-light',
      onClick && upcoming && 'group-hover/announcement:text-green-500',
    ];
  }, [announcement, upcoming, onClick]);

  const contentComponent = useMemo(() => {
    if (loading) {
      return <BaseSpinner />;
    }

    return !announcement ? (
      <span className='inline-block'>No announcements</span>
    ) : (
      <div className='flex w-full flex-col justify-between gap-2.5 px-4 py-3'>
        <h4 className='w-full pr-8 font-body text-base font-medium normal-case leading-5 tracking-normal text-accent'>
          {title}
        </h4>
        <p
          className={cx(
            'flex-1 font-medium leading-5',
            !fullSize ? 'line-clamp-3 max-h-16' : 'min-h-[64px]',
          )}
        >
          {description}
        </p>
        <div className='w-full text-center text-sm uppercase'>{dateText}</div>
      </div>
    );
  }, [announcement, loading, title, fullSize, description, dateText]);

  const handleClick = useCallback(() => {
    if (!onClick || !announcement) {
      return;
    }

    onClick(announcement);
  }, [announcement, onClick]);

  return (
    <div
      className={cx(
        'group/announcement relative flex rounded-xl border-[3px] bg-inherit',
        fullSize ? 'w-full' : '-2lg:w-[396px] h-[154px] w-full',
        loading && 'items-center !justify-center',
        ...wrapperClassName,
        className,
      )}
      onClick={handleClick}
      {...moreProps}
    >
      <div className='absolute -right-[3px] -top-[3px] h-10 w-[52px] overflow-hidden bg-inherit'>
        <BaseIcon
          name='quotes'
          weight='fill'
          size={50}
          className={cx(
            'absolute -right-[5px] -top-[11px] transition-colors',
            ...iconClassName,
          )}
        />
      </div>
      {contentComponent}
    </div>
  );
});
