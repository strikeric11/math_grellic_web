import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';

import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { generateFullName } from '../helpers/user.helper';
import { UserRole } from '../models/user.model';
import { useCurrentUserSingle } from '../hooks/use-current-user-single.hook';
import { useStudentAssignedTeacherSingle } from '../hooks/use-student-assigned-teacher-single.hook';
import { UserAvatarImg } from '../components/user-avatar-img.component';
import { UserMessengerLink } from '../components/user-messenger-link.component';
import { StudentUserAccountSingle } from '../components/student-user-account-single.component';

import type { StudentUserAccount, UserGender } from '../models/user.model';

const USER_ACCOUNT_PATH = `/${studentBaseRoute}/${studentRoutes.account.to}/${studentRoutes.account.editTo}`;

export function StudentCurrentUserSinglePage() {
  const { loading: userLoading, user: studentUser } = useCurrentUserSingle();

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
    isStudent,
  ] = useMemo(
    () => [
      studentUser?.userAccount as StudentUserAccount,
      studentUser?.email,
      studentUser?.publicId,
      studentUser?.userAccount?.phoneNumber,
      studentUser?.userAccount?.gender,
      generateFullName(
        studentUser?.userAccount?.firstName || '',
        studentUser?.userAccount?.lastName || '',
        studentUser?.userAccount?.middleName || '',
      ),
      studentUser?.userAccount?.messengerLink,
      studentUser?.role === UserRole.Student,
    ],
    [studentUser],
  );

  const loading = useMemo(
    () => userLoading || assignedTeacherLoading,
    [userLoading, assignedTeacherLoading],
  );

  const messengerLinkText = useMemo(
    () => messengerLink?.replace('https://', ''),
    [messengerLink],
  );

  if (!isStudent) {
    return null;
  }

  return (
    <BaseDataSuspense resolve={data?.main}>
      {loading ? (
        <BasePageSpinner />
      ) : (
        <div className='mx-auto w-full max-w-compact pb-16 pt-5'>
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
                <BaseLink
                  to={USER_ACCOUNT_PATH}
                  className='!px-3'
                  variant='solid'
                >
                  <BaseIcon name='pencil' size={24} />
                </BaseLink>
              </div>
            </div>
            <div className='flex flex-col items-start justify-between gap-2.5 -2xs:flex-row -2xs:items-center'>
              <div className='flex flex-col items-start gap-1 sm:flex-row sm:gap-2.5'>
                <BaseChip iconName='identification-badge'>{publicId}</BaseChip>
                <BaseDivider className='hidden !h-6 sm:block' vertical />
                <BaseChip iconName='device-mobile'>{phoneNumber}</BaseChip>
              </div>
              <UserMessengerLink to={messengerLink || ''} isLight>
                {messengerLinkText}
              </UserMessengerLink>
            </div>
          </div>
          <BaseDivider className='mb-2.5' />
          {userAccount && assignedTeacher && (
            <StudentUserAccountSingle
              userAccount={userAccount}
              assignedTeacher={assignedTeacher}
            />
          )}
        </div>
      )}
    </BaseDataSuspense>
  );
}
