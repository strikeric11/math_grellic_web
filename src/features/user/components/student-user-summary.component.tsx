import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { UserApprovalStatus } from '#/user/models/user.model';
import { formatPhoneNumber, generateFullName } from '../helpers/user.helper';
import { UserAvatarImg } from './user-avatar-img.component';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type { StudentUserAccount } from '#/user/models/user.model';

type Props = ComponentProps<'div'> & {
  student: StudentUserAccount;
  loading?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onDelete?: () => void;
};

export const StudentUserSummary = memo(function ({
  className,
  student,
  loading,
  onApprove,
  onReject,
  onDelete,
  ...moreProps
}: Props) {
  const [publicId, email, approvalStatus, gender, phoneNumber] = useMemo(
    () => [
      student.publicId || '—',
      student.email,
      student.approvalStatus,
      student.gender,
      formatPhoneNumber(student?.phoneNumber || ''),
    ],
    [student],
  );

  const fullName = useMemo(
    () =>
      generateFullName(student.firstName, student.lastName, student.middleName),
    [student],
  );

  const [statusLabel, statusIconName] = useMemo(() => {
    switch (approvalStatus) {
      case UserApprovalStatus.Approved:
        return ['Enrolled', 'check-square'];
      case UserApprovalStatus.Rejected:
        return [approvalStatus, 'x-square'];
      default:
        return [approvalStatus, 'minus-square'];
    }
  }, [approvalStatus]);

  return (
    <div
      className={cx(
        'flex w-full flex-col items-center gap-4 pb-2.5',
        className,
      )}
      {...moreProps}
    >
      <div className='flex w-full flex-1 flex-col items-center gap-4 pb-2.5 xs:flex-row'>
        <UserAvatarImg gender={gender} size='lg' />
        <div className='flex h-full w-full flex-1 flex-col gap-2.5'>
          {/* Info chips */}
          <div className='flex flex-col items-start gap-1 -3xs:flex-row -3xs:items-center -3xs:gap-2.5'>
            <BaseChip iconName='identification-badge'>{publicId}</BaseChip>
            <BaseDivider className='hidden !h-6 -3xs:block' vertical />
            <BaseChip iconName='identification-badge'>{phoneNumber}</BaseChip>
            <BaseDivider className='hidden !h-6 -3xs:block' vertical />
            <BaseChip iconName={statusIconName as IconName}>
              {statusLabel}
            </BaseChip>
          </div>
          {/* Title + email */}
          <div>
            <h2 className='font-body text-lg font-medium leading-tight tracking-normal text-accent'>
              {fullName}
            </h2>
            <span className='text-sm font-medium'>{email}</span>
          </div>
        </div>
      </div>
      <div className='flex min-h-[48px] w-full flex-col items-center justify-center gap-2.5 -3xs:flex-row'>
        {loading ? (
          <BaseSpinner size='xs' />
        ) : (
          <>
            {approvalStatus === UserApprovalStatus.Pending && (
              <>
                <BaseButton
                  className='!w-full'
                  disabled={loading}
                  onClick={onApprove}
                >
                  Approve Student
                </BaseButton>
                <BaseButton
                  className='!w-full'
                  variant='border'
                  disabled={loading}
                  onClick={onReject}
                >
                  Reject
                </BaseButton>
              </>
            )}
            <BaseButton
              className='!w-full'
              variant='border'
              disabled={loading}
              onClick={onDelete}
            >
              Delete
            </BaseButton>
          </>
        )}
      </div>
    </div>
  );
});
