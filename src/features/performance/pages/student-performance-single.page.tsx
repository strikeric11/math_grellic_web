import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';

import { formatPhoneNumber } from '#/user/helpers/user.helper';
import { UserAvatarImg } from '#/user/components/user-avatar-img.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { useStudentPerformanceSingle } from '../hooks/use-student-performance-single.hook';
import { StudentPerformanceSingle } from '../components/student-performance-single.component';

import type { UserGender } from '#/user/models/user.model';

export function StudentPerformanceSinglePage() {
  const { student } = useStudentPerformanceSingle();
  const data: any = useLoaderData();

  const [email, publicId, phoneNumber, gender, lastName, firstWithMiddleName] =
    useMemo(
      () =>
        student
          ? [
              student.email,
              student.publicId,
              formatPhoneNumber(student.phoneNumber),
              student.gender,
              student.lastName,
              `${student.firstName} ${student.middleName}`,
            ]
          : [],
      [student],
    );

  return (
    <BaseDataSuspense resolve={data?.main}>
      {student && (
        <div className='mx-auto w-full max-w-compact py-5 pb-16'>
          <div className='mb-2.5 flex w-full flex-col items-start justify-between gap-2.5 xs:flex-row xs:items-center'>
            {/* name + avatar */}
            <div className='flex items-center gap-x-2.5'>
              <UserAvatarImg gender={gender as UserGender} size='lg' />
              <h2 className='flex flex-col text-xl leading-snug'>
                <span>{lastName},</span>
                <span>{firstWithMiddleName}</span>
              </h2>
            </div>
            {/* info */}
            <div className='flex flex-col gap-y-1'>
              <BaseChip iconName='identification-badge'>{publicId}</BaseChip>
              <BaseChip iconName='at' className='!lowercase'>
                {email}
              </BaseChip>
              <BaseChip iconName='device-mobile'>{phoneNumber}</BaseChip>
            </div>
          </div>
          <BaseDivider className='mb-2.5' />
          <div className='mb-4 mt-2.5'>
            <h3 className='text-base'>Overall Progress</h3>
            <p>
              A comprehensive overview of your academic journey, based on your
              scores and achievements.
            </p>
          </div>
          <StudentPerformanceSingle student={student} isStudent />
        </div>
      )}
    </BaseDataSuspense>
  );
}
