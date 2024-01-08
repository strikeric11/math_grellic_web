import { useCallback } from 'react';
import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { useTeacherCurrenUserEdit } from '../hooks/use-teacher-current-user-edit.hook';
import { CurrentUserUpdateForm } from '../components/current-user-update-form.component';

import type {
  StudentUserUpdateFormData,
  TeacherUserUpdateFormData,
} from '../models/user-form-data.model';

export function TeacherUserAccountEditPage() {
  const {
    loading,
    isDone,
    setIsDone,
    teacherUserFormData,
    editCurrentTeacherUser,
  } = useTeacherCurrenUserEdit();

  const data: any = useLoaderData();

  const handleSubmit = useCallback(
    (data: TeacherUserUpdateFormData | StudentUserUpdateFormData) =>
      editCurrentTeacherUser(data as TeacherUserUpdateFormData),
    [editCurrentTeacherUser],
  );

  return (
    <BaseDataSuspense resolve={data?.main}>
      {!!teacherUserFormData && (
        <CurrentUserUpdateForm
          isDone={isDone}
          loading={loading}
          formData={teacherUserFormData}
          onSubmit={handleSubmit}
          onDone={setIsDone}
        />
      )}
    </BaseDataSuspense>
  );
}
