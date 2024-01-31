import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { generateFullName } from '../helpers/user.helper';
import { UserAvatarImg } from './user-avatar-img.component';
import { UserMessengerLink } from './user-messenger-link.component';

import type { ComponentProps } from 'react';
import type {
  StudentUserAccount,
  User,
  UserGender,
} from '../models/user.model';
import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';

type Props = ComponentProps<'div'> & {
  userAccount: StudentUserAccount;
  assignedTeacher: User;
};

const TEACHER_ACCOUNT_PATH = `/${studentBaseRoute}/${studentRoutes.account.to}/${studentRoutes.account.teacherAccountTo}`;

export const StudentUserAccountSingle = memo(function ({
  userAccount,
  assignedTeacher,
  ...moreProps
}: Props) {
  const aboutMe = useMemo(() => userAccount.aboutMe, [userAccount]);

  const [
    teacherPublicId,
    teacherFullName,
    teacherGender,
    teacherPhoneNumber,
    teacherMessengerLink,
  ] = useMemo(
    () => [
      assignedTeacher.publicId,
      assignedTeacher.userAccount &&
        generateFullName(
          assignedTeacher.userAccount.firstName,
          assignedTeacher.userAccount.lastName,
          assignedTeacher.userAccount.middleName,
        ),
      assignedTeacher.userAccount?.gender,
      assignedTeacher.userAccount?.phoneNumber,
      assignedTeacher.userAccount?.messengerLink,
    ],
    [assignedTeacher],
  );

  return (
    <div {...moreProps}>
      <BaseSurface className='mb-2.5' rounded='sm'>
        <div>
          <div className='mb-2.5 flex items-center justify-between '>
            <h3 className='text-base'>Teacher</h3>
            <BaseLink
              to={TEACHER_ACCOUNT_PATH}
              rightIconName='arrow-circle-right'
              size='xs'
            >
              See Details
            </BaseLink>
          </div>
          <div className='flex flex-col items-start justify-between gap-2.5 sm:flex-row sm:items-center'>
            <div className='flex h-16 items-center gap-x-2.5'>
              <UserAvatarImg gender={teacherGender as UserGender} />
              <div className='flex h-full flex-col justify-between py-0.5'>
                <span className='text-lg font-medium'>{teacherFullName}</span>
                <div className='flex items-center gap-2.5 !text-sm'>
                  <BaseChip
                    iconName='identification-badge'
                    className='!text-sm'
                  >
                    {teacherPublicId}
                  </BaseChip>
                  <BaseDivider className='!h-6' vertical />
                  <BaseChip iconName='device-mobile'>
                    {teacherPhoneNumber}
                  </BaseChip>
                </div>
              </div>
            </div>
            <UserMessengerLink to={teacherMessengerLink || ''} />
          </div>
        </div>
      </BaseSurface>
      <BaseSurface className='flex flex-col gap-4' rounded='sm'>
        <div>
          <h3 className='mb-2.5 text-base'>About Me</h3>
          <p className={cx(!aboutMe && 'pl-2')}>{aboutMe || '—'}</p>
        </div>
      </BaseSurface>
    </div>
  );
});
