import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';

import dayjs from '#/config/dayjs.config';
import { BaseModal } from '#/base/components/base-modal.component';
import { transformToExamScheduleFormData } from '../helpers/exam-transform.helper';
import { useExamScheduleEdit } from '../hooks/use-exam-schedule-edit.hook';
import { ExamScheduleUpsertForm } from '../components/exam-schedule-upsert-form.component';

import type { OutletContextType } from './teacher-exam-schedule-list.page';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseIcon } from '#/base/components/base-icon.component';

export function TeacherExamScheduleEditPage() {
  const { exam, examSchedule } = useOutletContext<OutletContextType>();

  const { loading, isDone, setIsDone, editExamSchedule, deleteExamSchedule } =
    useExamScheduleEdit(examSchedule?.id);

  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const examId = useMemo(() => exam?.id, [exam]);

  const examScheduleFormData = useMemo(
    () =>
      examSchedule
        ? transformToExamScheduleFormData({ ...examSchedule, exam })
        : undefined,
    [exam, examSchedule],
  );

  const deleteMessage = useMemo(() => {
    const dateFormat = dayjs(examScheduleFormData?.startDate).format(
      'MM-DD-YYYY',
    );
    return `Delete ${dateFormat} schedule?`;
  }, [examScheduleFormData]);

  useEffect(() => {
    if (examScheduleFormData) {
      return;
    }
    navigate('..');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetModal = useCallback(
    (isOpen: boolean) => () => {
      !loading && setOpenModal(isOpen);
    },
    [loading],
  );

  const handleDeleteExamSchedule = useCallback(async () => {
    if (!examScheduleFormData) {
      return;
    }

    try {
      const dateFormat = dayjs(examScheduleFormData?.startDate).format(
        'MM-DD-YYYY',
      );

      await deleteExamSchedule();

      toast.success(`Deleted ${dateFormat} schedule`);
      setOpenModal(false);
      navigate('..');
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [examScheduleFormData, deleteExamSchedule, navigate]);

  return (
    examId &&
    examScheduleFormData && (
      <>
        <ExamScheduleUpsertForm
          examId={examId}
          formData={examScheduleFormData}
          isDone={isDone}
          onDone={setIsDone}
          onSubmit={editExamSchedule}
          onDelete={handleSetModal(true)}
        />
        <BaseModal size='xs' open={openModal} onClose={handleSetModal(false)}>
          <div>
            <div className='mb-4 flex items-center gap-2'>
              <BaseIcon name='trash' size={28} />
              <span>{deleteMessage}</span>
            </div>
            <BaseButton
              className='!w-full'
              loading={loading}
              onClick={handleDeleteExamSchedule}
            >
              Delete Schedule
            </BaseButton>
          </div>
        </BaseModal>
      </>
    )
  );
}
