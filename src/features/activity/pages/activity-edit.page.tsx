import { useCallback, useMemo, useState } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { useActivityEdit } from '../hooks/use-activity-edit.hook';
import { ActivityUpsertForm } from '../components/activity-upsert-form.component';

const ACTIVITY_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.activity.to}`;

export function ActivityEditPage() {
  const { slug } = useParams();

  const {
    loading,
    isDone,
    setIsDone,
    activityFormData,
    editActivity,
    deleteActivity,
  } = useActivityEdit(slug);

  const data: any = useLoaderData();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const deleteMessage = useMemo(
    () => `Delete activity no. ${activityFormData?.orderNumber}?`,
    [activityFormData],
  );

  const handleSetModal = useCallback(
    (isOpen: boolean) => () => {
      !loading && setOpenModal(isOpen);
    },
    [loading],
  );

  const handleDeleteActivity = useCallback(async () => {
    if (!slug || !activityFormData) {
      return;
    }

    try {
      await deleteActivity();
      toast.success(
        `Deleted ${activityFormData.title} (No. ${activityFormData.orderNumber})`,
      );
      navigate(ACTIVITY_LIST_PATH);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [slug, activityFormData, deleteActivity, navigate]);

  return (
    <>
      <BaseDataSuspense resolve={data?.main}>
        <ActivityUpsertForm
          loading={loading}
          isDone={isDone}
          formData={activityFormData}
          onDone={setIsDone}
          onSubmit={editActivity}
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
            onClick={handleDeleteActivity}
          >
            Delete Activity
          </BaseButton>
        </div>
      </BaseModal>
    </>
  );
}
