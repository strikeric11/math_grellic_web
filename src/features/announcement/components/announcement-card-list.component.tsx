import { memo, useCallback, useMemo, useState } from 'react';
import cx from 'classix';

import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { AnnouncementCard } from './announcement-card.component';

import type { ComponentProps } from 'react';
import type { Announcement } from '../models/announcement.model';

type Props = ComponentProps<'div'> & {
  currentAnnouncements: Announcement[];
  upcomingAnnouncements?: Announcement[];
  loading?: boolean;
  onCardClick?: (announcement: Announcement) => void;
  onRefresh?: () => void;
};

export const AnnouncementCardList = memo(function ({
  className,
  loading,
  currentAnnouncements,
  upcomingAnnouncements,
  onCardClick,
  onRefresh,
  ...moreProps
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [announcements, announcementsIndicator] = useMemo(() => {
    const targetUpcomingAnnouncements = upcomingAnnouncements || [];

    return [
      [...currentAnnouncements, ...targetUpcomingAnnouncements],
      [
        ...currentAnnouncements.map(() => false),
        ...targetUpcomingAnnouncements.map(() => true),
      ],
    ];
  }, [currentAnnouncements, upcomingAnnouncements]);

  const disabled = useMemo(
    () => loading || !announcements.length,
    [loading, announcements],
  );

  const currentAnnouncement = useMemo(
    () => (!announcements.length ? null : announcements[currentIndex]),
    [currentIndex, announcements],
  );

  const isCurrentAnnouncementUpcoming = useMemo(() => {
    if (!currentAnnouncement || !upcomingAnnouncements?.length) {
      return false;
    }

    return upcomingAnnouncements.some((a) => a.id === currentAnnouncement.id);
  }, [currentAnnouncement, upcomingAnnouncements]);

  const handleChange = useCallback(
    (isNext: boolean) => () => {
      let value = 0;

      if (isNext) {
        value =
          currentIndex >= announcements.length - 1
            ? announcements.length - 1
            : currentIndex + 1;
      } else {
        value = currentIndex <= 0 ? 0 : currentIndex - 1;
      }

      setCurrentIndex(value);
    },
    [currentIndex, announcements],
  );

  const handleSetIndex = useCallback(
    (index: number) => () => setCurrentIndex(index),
    [],
  );

  return (
    <div
      className={cx('flex w-full flex-col bg-inherit', className)}
      {...moreProps}
    >
      <AnnouncementCard
        loading={loading}
        announcement={currentAnnouncement}
        upcoming={isCurrentAnnouncementUpcoming}
        onClick={onCardClick}
      />
      <div className='flex w-full flex-1 items-center justify-between'>
        <div className='flex items-center gap-1.5'>
          <div>
            <BaseIconButton
              name='caret-circle-left'
              variant='link'
              className='w-9'
              disabled={disabled}
              onClick={handleChange(false)}
            />
            <BaseIconButton
              name='caret-circle-right'
              variant='link'
              className='w-9'
              disabled={disabled}
              onClick={handleChange(true)}
            />
          </div>
          {onRefresh && (
            <>
              <BaseDivider className='!h-6' vertical />
              <BaseIconButton
                name='arrow-clockwise'
                variant='link'
                className='w-9'
                disabled={disabled}
                onClick={onRefresh}
              />
            </>
          )}
        </div>
        <div className='flex flex-1 items-center justify-end'>
          {announcementsIndicator.map((upcoming, index) => (
            <button
              key={`a-${index}`}
              className='flex items-center justify-center p-[3px]'
              onClick={handleSetIndex(index)}
            >
              <div
                className={cx(
                  'h-2.5 w-2.5 overflow-hidden rounded-full',
                  index === currentIndex
                    ? upcoming
                      ? 'bg-green-500'
                      : 'bg-primary'
                    : 'bg-primary/30',
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
