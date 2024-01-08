import { useCallback } from 'react';
import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { CurrentUserUpdateForm } from '../components/current-user-update-form.component';
import { useStudentCurrenUserEdit } from '../hooks/use-student-current-user-edit.hook';

import type {
  StudentUserUpdateFormData,
  TeacherUserUpdateFormData,
} from '../models/user-form-data.model';

export function StudentUserAccountEditPage() {
  const {
    loading,
    isDone,
    setIsDone,
    studentUserFormData,
    editCurrentStudentUser,
  } = useStudentCurrenUserEdit();

  const data: any = useLoaderData();

  const handleSubmit = useCallback(
    (data: TeacherUserUpdateFormData | StudentUserUpdateFormData) =>
      editCurrentStudentUser(data as StudentUserUpdateFormData),
    [editCurrentStudentUser],
  );

  return (
    <BaseDataSuspense resolve={data?.main}>
      {!!studentUserFormData && (
        <CurrentUserUpdateForm
          isDone={isDone}
          loading={loading}
          formData={studentUserFormData}
          onSubmit={handleSubmit}
          onDone={setIsDone}
          isStudent
        />
      )}
    </BaseDataSuspense>
  );
}
