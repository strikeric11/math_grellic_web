import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import {
  formatPhoneNumber,
  generateFullName,
} from '#/user/helpers/user.helper';
import { UserAvatarImg } from '#/user/components/user-avatar-img.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { UserMessengerLink } from '#/user/components/user-messenger-link.component';
import { useTeacherStudentPerformanceSingle } from '../hooks/use-teacher-student-performance-single.hook';
import { StudentPerformanceSingle } from '../components/student-performance-single.component';

import type { UserGender } from '#/user/models/user.model';

const STUDENT_USER_PATH = `/${teacherBaseRoute}/${teacherRoutes.student.to}`;

export function TeacherStudentPerformanceSinglePage() {
  const { student, loading } = useTeacherStudentPerformanceSingle();
  const data: any = useLoaderData();

  const [id, email, publicId, phoneNumber, fullName, gender, messengerLink] =
    useMemo(
      () =>
        student
          ? [
              student.id,
              student.email,
              student.publicId,
              formatPhoneNumber(student.phoneNumber),
              generateFullName(
                student.firstName,
                student.lastName,
                student.middleName,
              ),
              student.gender,
              student.messengerLink,
            ]
          : [],
      [student],
    );

  const editTo = useMemo(
    () => `${STUDENT_USER_PATH}/${id}/${teacherRoutes.student.editTo}`,
    [id],
  );

  return (
    <BaseDataSuspense resolve={data?.main}>
      {loading && <BasePageSpinner />}
      {student && (
        <div className='mx-auto w-full max-w-compact py-5 pb-16'>
          <div className='mb-2.5 flex flex-col gap-y-2.5'>
            <div className='flex w-full items-center justify-between'>
              <div className='flex items-center gap-2.5'>
                <UserAvatarImg gender={gender as UserGender} />
                <div>
                  <h2 className='pb-1 text-xl'>{fullName}</h2>
                  <span>{email}</span>
                </div>
              </div>
              <div>
                <BaseLink to={editTo} className='!px-3' variant='solid'>
                  <BaseIcon name='pencil' size={24} />
                </BaseLink>
              </div>
            </div>
            <div className='flex flex-col items-start justify-between gap-2.5 xs:flex-row xs:items-center'>
              <div className='flex items-center gap-2.5'>
                <BaseChip iconName='identification-badge'>{publicId}</BaseChip>
                <BaseDivider className='!h-6' vertical />
                <BaseChip iconName='device-mobile'>{phoneNumber}</BaseChip>
              </div>
              <UserMessengerLink to={messengerLink || ''} />
            </div>
          </div>
          <BaseDivider className='mb-2.5' />
          <StudentPerformanceSingle student={student} />
        </div>
      )}
    </BaseDataSuspense>
  );
}
