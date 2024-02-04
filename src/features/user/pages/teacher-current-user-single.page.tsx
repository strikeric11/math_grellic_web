import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { generateFullName } from '../helpers/user.helper';
import { UserRole } from '../models/user.model';
import { useCurrentUserSingle } from '../hooks/use-current-user-single.hook';
import { UserAvatarImg } from '../components/user-avatar-img.component';
import { UserMessengerLink } from '../components/user-messenger-link.component';
import { TeacherUserAccountSingle } from '../components/teacher-user-account-single.component';

import type { TeacherUserAccount, UserGender } from '../models/user.model';

const USER_ACCOUNT_PATH = `/${teacherBaseRoute}/${teacherRoutes.account.to}/${teacherRoutes.account.editTo}`;

export function TeacherCurrentUserSinglePage() {
  const { loading, user } = useCurrentUserSingle();
  const data: any = useLoaderData();

  const [
    userAccount,
    email,
    publicId,
    phoneNumber,
    gender,
    fullName,
    messengerLink,
    isTeacher,
  ] = useMemo(
    () => [
      user?.userAccount as TeacherUserAccount,
      user?.email,
      user?.publicId,
      user?.userAccount?.phoneNumber,
      user?.userAccount?.gender,
      generateFullName(
        user?.userAccount?.firstName || '',
        user?.userAccount?.lastName || '',
        user?.userAccount?.middleName || '',
      ),
      user?.userAccount?.messengerLink,
      user?.role === UserRole.Teacher,
    ],
    [user],
  );

  const messengerLinkText = useMemo(
    () => messengerLink?.replace('https://', ''),
    [messengerLink],
  );

  if (!isTeacher) {
    return null;
  }

  return (
    <BaseDataSuspense resolve={data?.main}>
      {loading || !isTeacher ? (
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
            <div className='flex flex-col items-start justify-between gap-2.5 xs:flex-row xs:items-center xs:gap-0'>
              <div className='flex items-center gap-2.5'>
                <BaseChip iconName='identification-badge'>{publicId}</BaseChip>
                <BaseDivider className='!h-6' vertical />
                <BaseChip iconName='device-mobile'>{phoneNumber}</BaseChip>
              </div>
              <UserMessengerLink to={messengerLink || ''} size='xs' isLight>
                {messengerLinkText}
              </UserMessengerLink>
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
