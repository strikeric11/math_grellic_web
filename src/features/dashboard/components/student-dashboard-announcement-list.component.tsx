import { memo, useCallback, useState } from 'react';
import cx from 'classix';

import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { AnnouncementCardList } from '#/announcement/components/announcement-card-list.component';
import { AnnouncementCard } from '#/announcement/components/announcement-card.component';

import type { ComponentProps } from 'react';
import type {
  Announcement,
  StudentAnnouncements,
} from '#/announcement/models/announcement.model';

type Props = ComponentProps<typeof BaseSurface> & {
  studentAnnouncements: StudentAnnouncements;
  loading?: boolean;
  onRefresh?: () => void;
};

export const StudentDashboardAnnouncementList = memo(function ({
  className,
  loading,
  studentAnnouncements: { currentAnnouncements },
  onRefresh,
  ...moreProps
}: Props) {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  const [openModal, setOpenModal] = useState(false);

  const handleSetModal = useCallback(
    (isOpen: boolean) => () => {
      !loading && setOpenModal(isOpen);
    },
    [loading],
  );

  const handleCardClick = useCallback((announcement: Announcement) => {
    setAnnouncement(announcement);
    setOpenModal(true);
  }, []);

  return (
    <>
      <BaseSurface
        className={cx('w-full bg-inherit !pb-0 !pt-[15px]', className)}
        {...moreProps}
      >
        <div className='mb-2.5 flex items-center justify-between'>
          <h3 className='text-lg leading-none'>Announcements</h3>
          <BaseIconButton
            name='arrow-clockwise'
            variant='link'
            className='!h-6 !w-6'
            disabled={loading}
            onClick={onRefresh}
          />
        </div>
        <AnnouncementCardList
          currentAnnouncements={currentAnnouncements}
          loading={loading}
          onCardClick={handleCardClick}
        />
      </BaseSurface>
      <BaseModal
        className='overflow-visible'
        open={openModal}
        size='sm'
        onClose={handleSetModal(false)}
      >
        {announcement && (
          <div className='relative flex w-full justify-center bg-inherit'>
            <AnnouncementCard announcement={announcement} fullSize />
          </div>
        )}
      </BaseModal>
    </>
  );
});
