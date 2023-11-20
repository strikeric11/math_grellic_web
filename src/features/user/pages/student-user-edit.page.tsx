import { useCallback, useState } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { useStudentUserEdit } from '../hooks/use-student-user-edit.hook';
import { StudentUserUpsertForm } from '../components/student-user-upsert-form.component';

const STUDENT_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.student.to}`;

export function StudentUserEditPage() {
  const { id } = useParams();

  const {
    loading,
    isDone,
    setIsDone,
    studentFormData,
    editStudent,
    deleteStudent,
  } = useStudentUserEdit(+(id || 0));

  const data: any = useLoaderData();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const handleSetModal = useCallback(
    (isOpen: boolean) => () => {
      !loading && setOpenModal(isOpen);
    },
    [loading],
  );

  const handleDeleteStudent = useCallback(async () => {
    if (!id || !studentFormData) {
      return;
    }

    try {
      await deleteStudent();
      toast.success(`Student deleted`);
      navigate(STUDENT_LIST_PATH);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [id, studentFormData, deleteStudent, navigate]);

  return (
    <>
      <BaseDataSuspense resolve={data?.main}>
        <StudentUserUpsertForm
          loading={loading}
          isDone={isDone}
          formData={studentFormData}
          onDone={setIsDone}
          onSubmit={editStudent}
          onDelete={handleSetModal(true)}
        />
      </BaseDataSuspense>
      <BaseModal size='xs' open={openModal} onClose={handleSetModal(false)}>
        <div>
          <div className='mb-4 flex items-center gap-2'>
            <BaseIcon name='trash' size={28} />
            <span>Delete student?</span>
          </div>
          <BaseButton
            className='!w-full'
            loading={loading}
            onClick={handleDeleteStudent}
          >
            Delete Exam
          </BaseButton>
        </div>
      </BaseModal>
    </>
  );
}
