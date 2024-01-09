import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';

import { generateFullName } from '#/user/helpers/user.helper';
import { UserGender } from '#/user/models/user.model';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { UserAvatarImg } from '#/user/components/user-avatar-img.component';
import { UserMessengerLink } from '#/user/components/user-messenger-link.component';

import { useStudentAssignedTeacherSingle } from '#/user/hooks/use-student-assigned-teacher-single.hook';

export function StudentHelpPage() {
  const { loading, user: assignedTeacher } = useStudentAssignedTeacherSingle();
  const data: any = useLoaderData();

  const [
    teacherPublicId,
    teacherPhoneNumber,
    teacherGender,
    teacherFullName,
    teacherMessengerLink,
  ] = useMemo(
    () => [
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
      {loading || !assignedTeacher ? (
        <BasePageSpinner />
      ) : (
        <div className='mx-auto w-full max-w-compact py-5'>
          <p className='mb-5'>
            This page serves as your go-to resource for understanding how to
            make the most of our platform and ensuring a smooth learning
            journey. Whether you're seeking clarification on a challenging
            lesson, in need of assistance with the platform, or just looking for
            guidance, your intstructor is here to offer you with the support you
            need.
          </p>
          <div className='max-w-sm'>
            <BaseSurface className='mb-2.5' rounded='sm'>
              <div className='flex h-16 items-center gap-x-2.5'>
                <UserAvatarImg gender={teacherGender as UserGender} />
                <div className='flex h-full flex-col justify-between py-0.5'>
                  <span className='text-lg font-medium'>{teacherFullName}</span>
                  <div className='flex items-center gap-2.5'>
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
            </BaseSurface>
            <UserMessengerLink
              to={teacherMessengerLink || ''}
              className='w-full'
            />
          </div>
        </div>
      )}
    </BaseDataSuspense>
  );
}
