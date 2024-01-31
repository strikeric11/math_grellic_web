import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';

import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { generateFullName } from '../helpers/user.helper';
import { useStudentAssignedTeacherSingle } from '../hooks/use-student-assigned-teacher-single.hook';
import { UserAvatarImg } from '../components/user-avatar-img.component';
import { UserMessengerLink } from '../components/user-messenger-link.component';
import { TeacherUserAccountSingle } from '../components/teacher-user-account-single.component';

import type { TeacherUserAccount, UserGender } from '../models/user.model';

export function StudentAssignedTeacherPage() {
  const { loading: assignedTeacherLoading, user: assignedTeacher } =
    useStudentAssignedTeacherSingle();

  const data: any = useLoaderData();

  const [
    userAccount,
    email,
    publicId,
    phoneNumber,
    gender,
    fullName,
    messengerLink,
  ] = useMemo(
    () => [
      assignedTeacher?.userAccount as TeacherUserAccount,
      assignedTeacher?.email,
      assignedTeacher?.publicId,
      assignedTeacher?.userAccount?.phoneNumber,
      assignedTeacher?.userAccount?.gender,
      generateFullName(
        assignedTeacher?.userAccount?.firstName || '',
        assignedTeacher?.userAccount?.lastName || '',
        assignedTeacher?.userAccount?.middleName || '',
      ),
      assignedTeacher?.userAccount?.messengerLink,
    ],
    [assignedTeacher],
  );

  return (
    <BaseDataSuspense resolve={data?.main}>
      {assignedTeacherLoading ? (
        <BasePageSpinner />
      ) : (
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
            </div>
            <div className='flex flex-col items-start justify-between gap-2.5 xs:flex-row xs:items-center xs:gap-0'>
              <div className='flex items-center gap-2.5'>
                <BaseChip iconName='identification-badge'>{publicId}</BaseChip>
                <BaseDivider className='!h-6' vertical />
                <BaseChip iconName='device-mobile'>{phoneNumber}</BaseChip>
              </div>
              <UserMessengerLink to={messengerLink || ''} size='xs' />
            </div>
          </div>
          <BaseDivider className='mb-2.5' />
          {userAccount && (
            <TeacherUserAccountSingle userAccount={userAccount} />
          )}
        </div>
      )}
    </BaseDataSuspense>
  );
}
