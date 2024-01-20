import { memo, useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import cx from 'classix';

import { transformToAnnouncementFormData } from '#/announcement/helpers/announcement-transform.helper';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { AnnouncementCardList } from '#/announcement/components/announcement-card-list.component';
import { AnnouncementCard } from '#/announcement/components/announcement-card.component';
import { AnnouncementUpsertPreview } from '#/announcement/components/announcement-upsert-preview.component';
import { AnnouncementUpsertForm } from '#/announcement/components/announcement-upsert-form.component';

import type { ComponentProps } from 'react';
import type {
  Announcement,
  TeacherAnnouncements,
} from '#/announcement/models/announcement.model';
import type { AnnouncementUpsertFormData } from '#/announcement/models/announcement-form-data.model';

type Props = ComponentProps<typeof BaseSurface> & {
  teacherAnnouncements: TeacherAnnouncements;
  loading?: boolean;
  onCreate?: (data: AnnouncementUpsertFormData) => Promise<Announcement>;
  onEdit?: (
    id: number,
    data: AnnouncementUpsertFormData,
  ) => Promise<Announcement>;
  onDelete?: (id: number) => void;
  onRefresh?: () => void;
};

export const TeacherDashboardAnnouncementList = memo(function ({
  className,
  loading,
  teacherAnnouncements: { currentAnnouncements, upcomingAnnouncements },
  onCreate,
  onEdit,
  onDelete,
  onRefresh,
  ...moreProps
}: Props) {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  const [announcementFormData, setAnnouncementFormData] =
    useState<AnnouncementUpsertFormData | null>(null);

  const [editAnnouncement, setEditAnnouncement] = useState<{
    id: number;
    formData: AnnouncementUpsertFormData;
  } | null>(null);

  const [hasPreviewError, setHasPreviewError] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const isUpcomingAnnouncement = useMemo(() => {
    if (!upcomingAnnouncements?.length || !announcement) {
      return false;
    }

    return upcomingAnnouncements.some((a) => a.id === announcement.id);
  }, [announcement, upcomingAnnouncements]);

  const handleSetModal = useCallback(
    (isOpen: boolean) => () => {
      !loading && setOpenModal(isOpen);
    },
    [loading],
  );

  const handleCardClick = useCallback((announcement: Announcement) => {
    setAnnouncement(announcement);
    setEditAnnouncement(null);
    setOpenModal(true);
  }, []);

  const handleCreateClick = useCallback(() => {
    setAnnouncement(null);
    setEditAnnouncement(null);
    setOpenModal(true);
  }, []);

  const handleEditClick = useCallback(() => {
    if (!announcement) {
      return;
    }

    const formData = transformToAnnouncementFormData(announcement);

    setEditAnnouncement({
      id: announcement.id,
      formData,
    });
    setAnnouncement(null);
    setOpenModal(true);
  }, [announcement]);

  const handleDeleteAnnouncement = useCallback(async () => {
    // For create
    if (!editAnnouncement || !onDelete) {
      setAnnouncementFormData(null);
      setHasPreviewError(false);
      setOpenModal(false);
      return;
    }

    try {
      await onDelete(editAnnouncement.id);

      toast.success(`Deleted ${editAnnouncement.formData.title}`);

      setEditAnnouncement(null);
      setHasPreviewError(false);
      setOpenModal(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [editAnnouncement, onDelete]);

  // For preview component button
  const handleCreateAnnouncement = useCallback(async () => {
    if (!announcementFormData) {
      setHasPreviewError(true);
      return;
    } else if (!onCreate) {
      return;
    }

    try {
      const announcement = await onCreate(announcementFormData);
      toast.success(`Created ${announcement.title}`);
      setAnnouncementFormData(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setHasPreviewError(false);
    }
  }, [announcementFormData, onCreate]);

  // For form button
  const handleUpsertAnnouncement = useCallback(
    async (data: AnnouncementUpsertFormData) => {
      if (!editAnnouncement) {
        setAnnouncementFormData(data);
        setHasPreviewError(false);
        setOpenModal(false);
        return;
      }

      try {
        if (!onEdit) {
          return;
        }

        const announcement = onEdit(editAnnouncement.id, data);
        setOpenModal(false);
        return announcement;
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [editAnnouncement, onEdit],
  );

  return (
    <>
      <BaseSurface
        className={cx('flex w-full flex-col gap-3.5 !pt-[15px]', className)}
        {...moreProps}
      >
        <div className='w-full bg-inherit'>
          <div className='mb-2.5 flex items-center justify-between'>
            <h3 className='text-lg leading-none'>Announcements</h3>
            {/* <BaseButton
              variant='link'
              size='sm'
              rightIconName='subtract-square'
            >
              View History
            </BaseButton> */}
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
            upcomingAnnouncements={upcomingAnnouncements}
            loading={loading}
            onCardClick={handleCardClick}
          />
        </div>
        <BaseDivider className='mb-[11px]' />
        <div className='w-full bg-inherit'>
          <h3 className='mb-3.5 text-lg leading-none'>
            Broadcast an Announcement
          </h3>
          <AnnouncementUpsertPreview
            loading={loading}
            formData={announcementFormData}
            hasError={hasPreviewError}
            onClick={handleCreateClick}
            onSubmit={handleCreateAnnouncement}
          />
        </div>
      </BaseSurface>
      <BaseModal
        className='overflow-visible'
        open={openModal}
        size='sm'
        onClose={handleSetModal(false)}
      >
        {announcement ? (
          <div className='relative flex w-full justify-center bg-inherit'>
            <AnnouncementCard
              announcement={announcement}
              upcoming={isUpcomingAnnouncement}
              fullSize
            />
            <BaseIconButton
              name='pencil'
              variant='solid'
              size='sm'
              className='absolute bottom-2 right-2'
              onClick={handleEditClick}
            />
          </div>
        ) : (
          <AnnouncementUpsertForm
            loading={loading}
            formData={
              editAnnouncement
                ? editAnnouncement.formData
                : announcementFormData || undefined
            }
            onSubmit={handleUpsertAnnouncement}
            onDelete={handleDeleteAnnouncement}
            withPreview={!editAnnouncement}
          />
        )}
      </BaseModal>
    </>
  );
});
