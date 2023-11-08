import { useState, useMemo, useCallback } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { useMeetingScheduleEdit } from '../hooks/use-meeting-schedule-edit.hook';
import { MeetingScheduleUpsertForm } from '../components/meeting-schedule-upsert-form.component';

const MEETING_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.schedule.to}/${teacherRoutes.schedule.meeting.to}`;

export function MeetingScheduleEditPage() {
  const { id } = useParams();

  const {
    loading,
    isDone,
    setIsDone,
    meetingScheduleFormData,
    editMeetingSchedule,
    deleteMeetingSchedule,
  } = useMeetingScheduleEdit(+(id || 0));

  const data: any = useLoaderData();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const deleteMessage = useMemo(
    () => `Delete meeting - ${meetingScheduleFormData?.title}?`,
    [meetingScheduleFormData],
  );

  const handleSetModal = useCallback(
    (isOpen: boolean) => () => {
      !loading && setOpenModal(isOpen);
    },
    [loading],
  );

  const handleDeleteMeetingSchedule = useCallback(async () => {
    if (!id || !meetingScheduleFormData) {
      return;
    }

    try {
      await deleteMeetingSchedule();
      toast.success(`Deleted ${meetingScheduleFormData.title}`);
      navigate(MEETING_LIST_PATH);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [id, meetingScheduleFormData, deleteMeetingSchedule, navigate]);

  return (
    <>
      <BaseDataSuspense resolve={data?.main}>
        <MeetingScheduleUpsertForm
          loading={loading}
          isDone={isDone}
          formData={meetingScheduleFormData}
          onDone={setIsDone}
          onSubmit={editMeetingSchedule}
          onDelete={handleSetModal(true)}
        />
      </BaseDataSuspense>
      <BaseModal size='xs' open={openModal} onClose={handleSetModal(false)}>
        <div>
          <div className='mb-4 flex items-center gap-2'>
            <BaseIcon name='trash' size={28} />
            <span>{deleteMessage}</span>
          </div>
          <BaseButton
            className='!w-full'
            loading={loading}
            onClick={handleDeleteMeetingSchedule}
          >
            Delete Meeting
          </BaseButton>
        </div>
      </BaseModal>
    </>
  );
}
