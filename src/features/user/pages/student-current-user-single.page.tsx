import { memo, useMemo } from 'react';
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
import { UserAvatarImg } from '../components/user-avatar-img.component';
import { UserMessengerLink } from '../components/user-messenger-link.component';
import { StudentUserAccountSingle } from '../components/student-user-account-single.component';

import type { StudentUserAccount, UserGender } from '../models/user.model';

const USER_ACCOUNT_PATH = `/${studentBaseRoute}/${studentRoutes.account.to}/${studentRoutes.account.editTo}`;

export const StudentCurrentUserSinglePage = memo(function () {
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
    isStudent,
  ] = useMemo(
    () => [
      user?.userAccount as StudentUserAccount,
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
      user?.role === UserRole.Student,
    ],
    [user],
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
      {loading || !isStudent ? (
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
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2.5'>
                <BaseChip iconName='identification-badge'>{publicId}</BaseChip>
                <BaseDivider className='!h-6' vertical />
                <BaseChip iconName='device-mobile'>{phoneNumber}</BaseChip>
              </div>
              <UserMessengerLink to={messengerLink || ''} size='xs'>
                {messengerLinkText}
              </UserMessengerLink>
            </div>
          </div>
          <BaseDivider className='mb-2.5' />
          {userAccount && (
            <StudentUserAccountSingle userAccount={userAccount} />
          )}
        </div>
      )}
    </BaseDataSuspense>
  );
});
