import { memo, useMemo } from 'react';
import cx from 'classix';

import { teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseLink } from '#/base/components/base-link.component';
import { formatPhoneNumber, generateFullName } from '../helpers/user.helper';
import { UserAvatarImg } from './user-avatar-img.component';

import type { ComponentProps } from 'react';
import type { StudentUserAccount, UserGender } from '#/user/models/user.model';

type Props = ComponentProps<'div'> & {
  student: StudentUserAccount;
};

const EDIT_PATH = teacherRoutes.student.editTo;

export const StudentUserSingle = memo(function ({
  className,
  student,
  ...moreProps
}: Props) {
  const [email, publicId, phoneNumber, gender] = useMemo(
    () =>
      student
        ? [
            student.email,
            student.publicId,
            formatPhoneNumber(student.phoneNumber),
            student.gender,
          ]
        : [],
    [student],
  );

  const fullName = useMemo(
    () =>
      student
        ? generateFullName(
            student.firstName,
            student.lastName,
            student.middleName,
          )
        : '',
    [student],
  );

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <div className='mb-2.5 flex flex-col gap-y-4'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <UserAvatarImg gender={gender as UserGender} />
            <div>
              <h2 className='pb-1 text-xl'>{fullName}</h2>
              <span>{email}</span>
            </div>
          </div>
          <div>
            <BaseLink to={EDIT_PATH} className='!px-3' variant='solid'>
              <BaseIcon name='pencil' size={24} />
            </BaseLink>
          </div>
        </div>
        <div className='flex items-center gap-2.5'>
          <BaseChip iconName='identification-badge'>{publicId}</BaseChip>
          <BaseDivider className='!h-6' vertical />
          <BaseChip iconName='device-mobile'>{phoneNumber}</BaseChip>
        </div>
      </div>
      <BaseDivider className='mb-2.5' />
      <div>{/* TODO student progress */}</div>
    </div>
  );
});
