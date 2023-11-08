import { useCallback, useMemo, useState } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseButton } from '#/base/components/base-button.components';
import { LessonUpsertForm } from '../components/lesson-upsert-form.component';
import { useLessonEdit } from '../hooks/use-lesson-edit.hook';

const LESSON_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.lesson.to}`;

export function LessonEditPage() {
  const { slug } = useParams();

  const {
    loading,
    isDone,
    setIsDone,
    lessonFormData,
    editLesson,
    deleteLesson,
  } = useLessonEdit(slug);

  const data: any = useLoaderData();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const deleteMessage = useMemo(
    () => `Delete lesson no. ${lessonFormData?.orderNumber}?`,
    [lessonFormData],
  );

  const handleSetModal = useCallback(
    (isOpen: boolean) => () => {
      !loading && setOpenModal(isOpen);
    },
    [loading],
  );

  const handleDeleteLesson = useCallback(async () => {
    if (!slug || !lessonFormData) {
      return;
    }

    try {
      await deleteLesson();
      toast.success(
        `Deleted ${lessonFormData.title} (No. ${lessonFormData.orderNumber})`,
      );
      navigate(LESSON_LIST_PATH);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [slug, lessonFormData, deleteLesson, navigate]);

  return (
    <>
      <BaseDataSuspense resolve={data?.main}>
        <LessonUpsertForm
          loading={loading}
          isDone={isDone}
          formData={lessonFormData}
          onDone={setIsDone}
          onSubmit={editLesson}
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
            onClick={handleDeleteLesson}
          >
            Delete Lesson
          </BaseButton>
        </div>
      </BaseModal>
    </>
  );
}
