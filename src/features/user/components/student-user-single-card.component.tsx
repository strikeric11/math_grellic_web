import { memo, useCallback, useMemo } from 'react';
import { Menu } from '@headlessui/react';
import cx from 'classix';

import {
  formatPhoneNumber,
  generateFullName,
} from '#/user/helpers/user.helper';
import { UserApprovalStatus } from '#/user/models/user.model';
import { UserAvatarImg } from '#/user/components/user-avatar-img.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { BaseSurface } from '#/base/components/base-surface.component';

import type { ComponentProps, MouseEvent } from 'react';
import type { StudentUserAccount } from '#/user/models/user.model';
import type { IconName } from '#/base/models/base.model';

type Props = ComponentProps<typeof BaseSurface> & {
  student: StudentUserAccount;
  onDetails?: () => void;
  onEdit?: () => void;
};

type ContextMenuProps = ComponentProps<'div'> & {
  isDraft?: boolean;
  onDetails?: () => void;
  onEdit?: () => void;
};

const menuIconProps = { weight: 'bold', size: 48 } as ComponentProps<
  typeof BaseIconButton
>['iconProps'];

const ContextMenu = memo(function ({
  className,
  onDetails,
  onEdit,
  ...moreProps
}: ContextMenuProps) {
  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  }, []);

  return (
    <div
      className={cx('pointer-events-auto relative h-12 w-7', className)}
      {...moreProps}
    >
      <BaseDropdownMenu
        customMenuButton={
          <div className='relative h-12 w-7'>
            <Menu.Button
              as={BaseIconButton}
              name='dots-three-vertical'
              variant='link'
              className='button absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
              iconProps={menuIconProps}
              onClick={handleClick}
            />
          </div>
        }
      >
        <Menu.Item
          as={BaseDropdownButton}
          iconName='article'
          onClick={onDetails}
        >
          Details
        </Menu.Item>
        <BaseDivider className='my-1' />
        <Menu.Item as={BaseDropdownButton} iconName='pencil' onClick={onEdit}>
          Update
        </Menu.Item>
      </BaseDropdownMenu>
    </div>
  );
});

export const StudentUserSingleCard = memo(function ({
  className,
  student,
  onDetails,
  onEdit,
  ...moreProps
}: Props) {
  const [publicId, email, approvalStatus, gender, phoneNumber] = useMemo(
    () => [
      student.publicId || '—',
      student.email,
      student.approvalStatus,
      student.gender,
      formatPhoneNumber(student.phoneNumber),
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
    <BaseSurface
      className={cx(
        'pointer-events-none flex w-full items-center gap-5 !p-2.5 transition-all hover:cursor-pointer hover:!border-primary-focus hover:shadow-md hover:ring-1 hover:ring-primary-focus',
        className,
      )}
      rounded='sm'
      {...moreProps}
    >
      <div className='flex flex-1 items-center gap-4'>
        <div
          className='group pointer-events-auto flex flex-1 flex-col items-center gap-4 sm:flex-row'
          tabIndex={0}
          onClick={onDetails}
        >
          <UserAvatarImg gender={gender} size='lg' />
          <div className='flex w-full items-center'>
            <div className='flex h-full w-full flex-1 flex-col gap-2'>
              {/* Info chips */}
              <div className='flex flex-col items-start gap-1 xs:flex-row xs:items-center xs:gap-2.5'>
                <BaseChip iconName='identification-badge'>{publicId}</BaseChip>
                <BaseDivider className='hidden !h-6 xs:block' vertical />
                <BaseChip iconName='device-mobile'>{phoneNumber}</BaseChip>
                <BaseDivider className='hidden !h-6 xs:block' vertical />
                <BaseChip iconName={statusIconName as IconName}>
                  {statusLabel}
                </BaseChip>
              </div>
              {/* Title + email */}
              <div>
                <h2 className='font-body text-lg font-medium leading-tight tracking-normal text-accent group-hover:text-primary-focus'>
                  {fullName}
                </h2>
                <span className='text-sm font-medium'>{email}</span>
              </div>
            </div>
            <ContextMenu
              className='block sm:hidden'
              onDetails={onDetails}
              onEdit={onEdit}
            />
          </div>
        </div>
        <ContextMenu
          className='hidden sm:block'
          onDetails={onDetails}
          onEdit={onEdit}
        />
      </div>
    </BaseSurface>
  );
});

export const StudentUserSingleCardSkeleton = memo(function () {
  return (
    <div className='flex w-full animate-pulse flex-col items-center justify-between gap-4 rounded-lg bg-accent/20 py-2.5 pl-2.5 pr-4 -3xs:flex-row'>
      <div className='h-[80px] w-[80px] rounded bg-accent/20' />
      <div className='flex w-full flex-1 flex-col justify-between gap-5 -3xs:py-2.5'>
        <div className='h-6 w-full rounded bg-accent/20 -3xs:w-[240px]' />
        <div className='h-6 w-4/5 rounded bg-accent/20 -3xs:w-[180px]' />
      </div>
      <div className='hidden h-full gap-5 -3xs:flex'>
        <div className='h-full w-5 rounded bg-accent/20' />
      </div>
    </div>
  );
});
