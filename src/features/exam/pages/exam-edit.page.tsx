import { useCallback, useMemo, useState } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { useExamEdit } from '../hooks/use-exam-edit.hook';
import { ExamUpsertForm } from '../components/exam-upsert-form.component';

const EXAM_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.exam.to}`;

export function ExamEditPage() {
  const { slug } = useParams();

  const { loading, isDone, setIsDone, examFormData, editExam, deleteExam } =
    useExamEdit(slug);

  const data: any = useLoaderData();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const deleteMessage = useMemo(
    () => `Delete exam no. ${examFormData?.orderNumber}?`,
    [examFormData],
  );

  const handleSetModal = useCallback(
    (isOpen: boolean) => () => {
      !loading && setOpenModal(isOpen);
    },
    [loading],
  );

  const handleDeleteExam = useCallback(async () => {
    if (!slug || !examFormData) {
      return;
    }

    try {
      await deleteExam();
      toast.success(
        `Deleted ${examFormData.title} (No. ${examFormData.orderNumber})`,
      );
      navigate(EXAM_LIST_PATH);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [slug, examFormData, deleteExam, navigate]);

  return (
    <>
      <BaseDataSuspense resolve={data?.main}>
        <ExamUpsertForm
          loading={loading}
          isDone={isDone}
          formData={examFormData}
          onDone={setIsDone}
          onSubmit={editExam}
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
            onClick={handleDeleteExam}
          >
            Delete Exam
          </BaseButton>
        </div>
      </BaseModal>
    </>
  );
}
